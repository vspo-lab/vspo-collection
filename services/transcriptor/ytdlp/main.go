package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
)

type ExecRequest struct {
	Bin  string   `json:"bin"`
	Args []string `json:"args"`
}

type ExecResponse struct {
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exit_code"`
}

func execHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"POST only"}`, http.StatusMethodNotAllowed)
		return
	}

	var req ExecRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"invalid json: %s"}`, err), http.StatusBadRequest)
		return
	}

	if req.Bin == "" {
		http.Error(w, `{"error":"bin is required"}`, http.StatusBadRequest)
		return
	}

	cmd := exec.Command(req.Bin, req.Args...)
	var stdout, stderr []byte
	stdoutPipe, _ := cmd.StdoutPipe()
	stderrPipe, _ := cmd.StderrPipe()

	w.Header().Set("Content-Type", "application/json")

	if err := cmd.Start(); err != nil {
		json.NewEncoder(w).Encode(ExecResponse{
			Stderr:   err.Error(),
			ExitCode: -1,
		})
		return
	}

	stdout, _ = readAll(stdoutPipe)
	stderr, _ = readAll(stderrPipe)

	exitCode := 0
	if err := cmd.Wait(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			exitCode = -1
		}
	}

	json.NewEncoder(w).Encode(ExecResponse{
		Stdout:   string(stdout),
		Stderr:   string(stderr),
		ExitCode: exitCode,
	})
}

func readAll(r interface{ Read([]byte) (int, error) }) ([]byte, error) {
	var buf []byte
	tmp := make([]byte, 4096)
	for {
		n, err := r.Read(tmp)
		if n > 0 {
			buf = append(buf, tmp[:n]...)
		}
		if err != nil {
			break
		}
	}
	return buf, nil
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"status":"ok","instance":"%s"}`, os.Getenv("CLOUDFLARE_DURABLE_OBJECT_ID"))
}

func main() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	router := http.NewServeMux()
	router.HandleFunc("/", healthHandler)
	router.HandleFunc("/exec", execHandler)

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		log.Printf("Server listening on %s\n", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	sig := <-stop
	log.Printf("Received signal (%s), shutting down server...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}

	log.Println("Server shutdown successfully")
}