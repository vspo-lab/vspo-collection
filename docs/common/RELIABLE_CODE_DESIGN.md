# Reliable Code Design Guidelines

This document summarizes principles for designing code that is resistant to errors, along with implementation patterns in Go. It concretizes insights from t-wada's presentations in the context of the Go language.

## Design Principles

### 1. Defense by Types

**Purpose**: Prevent invalid values from entering the system at compile time

**Practice**:
- Do not use primitive types (`string`, `int`) directly; define meaningful value object types instead
- Express domain-specific constraints through types
- Aim for type designs where invalid states are unrepresentable

**Examples in this repository**:
- `VideoID`, `CreatorID` - Make the meaning of string IDs explicit through types
- `PlatformKind` - Represent only allowed platforms
- `ProcessState` - Allow only valid state transitions

### 2. Pursuing Immutability

**Purpose**: Prevent unexpected state changes and make code easier to understand

**Practice**:
- Keep struct fields unexported and provide getters
- State-changing methods should return new values or explicitly use pointer receivers
- Make side-effecting operations explicit through method names

**Examples in this repository**:
- `ProcessState.Start()` returns a new state
- `Video.StartJob()` uses a pointer receiver to make mutation explicit

#### Preventing the Aliasing Problem

**What is the aliasing problem?**:
A situation where multiple variables reference the same memory location, and a change through one variable unintentionally affects the other.

**Solving it through immutable objects**:
- By designing objects whose state is never modified, you fundamentally prevent unexpected side effects from aliasing
- When you want to change a value, generate and return a new object

**Example**:
```go
// Bad: Mutable design (aliasing problem occurs)
type Config struct {
    MaxRetry int
}

func (c *Config) SetMaxRetry(n int) {
    c.MaxRetry = n  // If the reference is shared, unintended changes propagate
}

func main() {
    cfg1 := &Config{MaxRetry: 3}
    cfg2 := cfg1  // Sharing the same pointer (aliasing)
    cfg2.SetMaxRetry(10)
    fmt.Println(cfg1.MaxRetry)  // 10 - cfg1 is also changed
}

// Good: Immutable design
type Config struct {
    maxRetry int  // Unexported field
}

func (c Config) MaxRetry() int {
    return c.maxRetry
}

func (c Config) WithMaxRetry(n int) Config {
    return Config{maxRetry: n}  // Returns a new instance
}

func main() {
    cfg1 := Config{maxRetry: 3}
    cfg2 := cfg1.WithMaxRetry(10)  // A new instance is created
    fmt.Println(cfg1.MaxRetry())    // 3 - cfg1 is unchanged
    fmt.Println(cfg2.MaxRetry())    // 10
}
```

**Notes for Go**:
- Slices and maps behave like pointers, so even after copying, internal data is shared
- When deep copying is needed, implement an explicit copy function
- Leverage value receivers (`func (c Config)`) and pass-by-value to encourage implicit copying

### 3. Invariant Validation in Constructors

**Purpose**: Prevent objects in invalid states from being created

**Practice**:
- Validate input in all `New*` / `Parse*` functions
- Return an error when validation fails
- If the zero value is not a valid state, always require going through a constructor

**Examples in this repository**:
- `ParseVideoID` - Rejects empty strings
- `ParseProcessState` - Rejects unknown states
- `video.New` - Validates required fields

### 4. Separation of Facts and Information

**Purpose**: Centralize data interpretation in the domain layer and prevent conversion errors

**Practice**:
- Represent raw data received from external sources as DTOs (facts)
- Define types used by domain logic as Domain types (information)
- Centralize conversions in the adapter layer

**Examples in this repository**:
- `infra/*/internal/dto/` - Firestore/Pub/Sub payloads (facts)
- `domain/video/Video` - Types used by business logic (information)

### 5. Making Invalid States Unrepresentable

**Purpose**: Eliminate invalid values through design rather than defensive programming (excessive if-statements)

**Practice**:
- Minimize the state space (possible value combinations) through the type system
- Avoid primitive types; define domain-specific types instead
- Aim for type designs where invalid states cannot be expressed

**Examples in this repository**:
- `ProcessState` interface represents states through types
- `PlatformKind` represents only allowed platforms
- Value objects prevent the creation of invalid values

**Anti-pattern**:
```go
// Bad: Managing state with strings
type Video struct {
    Status string // "pending", "running", "success", "failed" etc. mixed in
}

// Good: Managing state with types
type ProcessState interface {
    Name() string
}
type ProcessPending struct{}
type ProcessRunning struct{}
```

### 6. Leveraging Static Analysis

**Purpose**: Detect bugs proactively with lint tools, not just through tests

**Practice**:
- Check general code quality with `golangci-lint`
- Mechanically enforce design rules with custom lints (`go-arch-lint`, `usecasegodoc`, `valueobject`, `tabletest`)
- Run automatically in CI/CD to prevent violations

**Examples in this repository**:
- `.go-arch-lint.yml` enforces Clean Architecture dependency direction
- `valueobject` lint detects direct initialization of value objects
- `tabletest` lint enforces table-driven test format

### 7. Guaranteeing Integrity

**Purpose**: Ensure that an object is always in a consistent state from the moment it is created

**Practice**:
- Validate all invariants in the constructor
- Do not expose partially initialized objects
- Avoid setters; prefer immutable objects

**Example in this repository**:
```go
// Constructor that guarantees integrity
func New(platform platform.PlatformKind, videoID, creatorID string) (*Video, error) {
    vid, err := ParseVideoID(videoID)
    if err != nil {
        return nil, err
    }
    cid, err := ParseCreatorID(creatorID)
    if err != nil {
        return nil, err
    }
    // All fields are valid at the point of creation
    return &Video{
        Platform:  platform,
        VideoID:   vid,
        CreatorID: cid,
    }, nil
}
```

### 8. Appropriate Placement of Responsibilities

**Purpose**: Place check logic in the appropriate object and increase cohesion

**Practice**:
- "Start date is before end date" is the responsibility of `DateTimeRange`
- "Can the process be executed?" is the responsibility of `ProcessState`
- Domain rules are confined within domain objects

**Example in this repository**:
```go
// Bad: Checking on the caller side
func (uc *UseCase) Process(ctx context.Context) error {
    if state.Name() != "pending" {
        return errors.New("not pending")
    }
    // ...
}

// Good: The state object itself performs the check
type ProcessPending struct{}
func (ProcessPending) Start() ProcessRunning {
    // The type guarantees that this is a startable state
    return ProcessRunning{}
}
```

---

## Legacy Code Improvement Strategy

### Priority Order

When improving legacy code, address items in the following order:

1. **Version control**: Make change history trackable (git)
2. **Automation**: Establish a state where `make lint && make test` always passes
3. **Testing**: Gradually increase coverage

### Establishing the Three Pillars of Development

Establishing the following three pillars is the key to success in legacy code improvement.

#### 1. Version Control (Git)

**Importance**: Top priority

**Rationale**:
- Development without version control is **extremely dangerous**
- Without change history, it is impossible to track who changed what and when
- The inability to rollback or diff directly leads to production incidents

**Practice**:
- When inheriting legacy code, create a Git repository first
- Write clear commit messages (Angular-style is recommended)
- Define a branch strategy (e.g., main/develop/feature branches)

#### 2. Automation

**Importance**: Early adoption provides high leverage

**Rationale**:
- Manual deployment and builds are error-prone and time-consuming
- Introducing automation early delivers benefits across all subsequent development
- CI/CD pipelines improve both development speed and quality

**Practice**:
- Automate build and test with `Makefile` or `scripts/`
- Run automated tests and lint via GitHub Actions or other CI tools
- Automate the deployment process to eliminate human error

**Examples in this repository**:
```bash
make lint   # Run static analysis automatically
make test   # Run unit tests automatically
make ci     # Run CI-equivalent processing automatically
```

#### 3. Automated Testing

**Importance**: Code without tests is "bad code"

**Definition** (Michael Feathers):
> "Code without tests is legacy code"

**Rationale**:
- Manual verification is unreliable, expensive, and dependent on individual knowledge
- With tests, you can automatically verify that existing behavior is preserved during refactoring
- Even starting with simple tests that confirm "the happy path works" has value

**Practice**:
- For existing code, start with rough tests that just confirm "it's not undefined" or "it doesn't panic"
- Write new code test-first (Sprout pattern)
- Gradually increase test coverage

**Testing phases**:
1. Phase 1: Confirm it doesn't panic
2. Phase 2: Confirm the happy path works
3. Phase 3: Add error cases and edge cases
4. Phase 4: Add exact-match verification (see the "Testing Strategy" section for details)

### Extract Pattern

Extract testable pure functions from existing code:

1. Identify the logic you want to test
2. Transform it to accept external dependencies (I/O, time, randomness) as arguments
3. Extract it as a pure function
4. Add unit tests
5. Call the extracted function from the original location

```go
// Before: Hard to test
func ProcessOrder(orderID string) error {
    order := db.GetOrder(orderID)  // External dependency
    if time.Now().After(order.Deadline) {  // Time dependency
        return errors.New("deadline exceeded")
    }
    // ...
}

// After: Extract a pure function
func IsDeadlineExceeded(deadline, now time.Time) bool {
    return now.After(deadline)
}

func ProcessOrder(orderID string, now time.Time) error {
    order := db.GetOrder(orderID)
    if IsDeadlineExceeded(order.Deadline, now) {
        return errors.New("deadline exceeded")
    }
    // ...
}
```

### Sprout Pattern

Write new code test-first:

1. Clarify the requirements for the new feature
2. Write the test first (red)
3. Write the minimal implementation to make the test pass (green)
4. Refactor (refactor)
5. Minimize integration points with existing code

```go
// Step 1: Write the test first
func TestCalculateDiscount(t *testing.T) {
    tests := []struct {
        name     string
        price    int
        quantity int
        want     int
    }{
        {name: "no discount", price: 100, quantity: 1, want: 100},
        {name: "bulk discount", price: 100, quantity: 10, want: 900},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := CalculateDiscount(tt.price, tt.quantity)
            if got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}

// Step 2: Minimal implementation
func CalculateDiscount(price, quantity int) int {
    if quantity >= 10 {
        return price * quantity * 9 / 10
    }
    return price * quantity
}
```

### Gradual Improvement Process

When inheriting legacy code, improve it gradually through the following four steps.

#### Step 1: Assess Current State and Set Up the Environment

**Purpose**: Build the foundation for improvement

**Actions**:
1. **Introduce Git**: Introduce version control as the top priority
2. **Set up CI**: Set up an environment that runs lint and tests automatically via GitHub Actions, etc.
3. **Understand the current state**: Read the entire codebase and understand dependencies and structure
4. **Create documentation**: Prepare minimal documentation such as README and architecture diagrams

**Notes**:
- Do not make major code changes at this stage
- First, establish the "defensive" posture (version control and automation)

#### Step 2: Model Separation and Logic Extraction

**Purpose**: Separate business logic from handlers

**Actions**:
1. **Define models**: Define domain entities and value objects
2. **Apply the Extract pattern**: Extract pure functions from handlers and controllers
3. **Add tests**: Add unit tests for the extracted functions

**Example**:
```go
// Before: Business logic mixed into HTTP handler
func HandleOrder(w http.ResponseWriter, r *http.Request) {
    orderID := r.URL.Query().Get("id")
    order := db.GetOrder(orderID)
    if time.Now().After(order.Deadline) {
        http.Error(w, "deadline exceeded", 400)
        return
    }
    // ...
}

// After: Separate the logic
func IsDeadlineExceeded(deadline, now time.Time) bool {
    return now.After(deadline)
}

func HandleOrder(w http.ResponseWriter, r *http.Request, now time.Time) {
    orderID := r.URL.Query().Get("id")
    order := db.GetOrder(orderID)
    if IsDeadlineExceeded(order.Deadline, now) {
        http.Error(w, "deadline exceeded", 400)
        return
    }
    // ...
}
```

#### Step 3: Separating Facts and Interpretation

**Purpose**: Prevent data conversion errors and clarify domain logic

**Actions**:
1. **Define DTOs**: Define raw data received from external sources (JSON, DB records, etc.) as DTOs
2. **Define Domain types**: Define types used by business logic as domain models
3. **Establish the conversion layer**: Centralize DTO-to-Domain conversions in the adapter layer

**Examples in this repository**:
- `infra/*/internal/dto/` - Firestore/Pub/Sub payloads (**facts**)
- `domain/video/Video` - Types used by business logic (**information**)

See "Design Principle 4. Separation of Facts and Information" for details.

#### Step 4: Architecture Definition

**Purpose**: Establish a design that enables sustainable development

**Actions**:
1. **Select an architecture pattern**: Choose Clean Architecture, Hexagonal Architecture, etc.
2. **Clarify dependency direction**: Enforce one-way dependencies from outer layers (Infra) to inner layers (Domain)
3. **Introduce automated checks**: Automatically detect dependency direction violations with `go-arch-lint`, etc.
4. **Document**: Record architecture decisions in `docs/ARCHITECTURE.md`, etc.

**Examples in this repository**:
- Adopted Clean Architecture + DDD
- `.go-arch-lint.yml` enforces dependency direction
- `docs/ARCHITECTURE_RULES.md` documents the rules

---

## Testing Strategy

### Target Request/Response Granularity

**Purpose**: Write tests that are resilient to refactoring by maintaining distance from implementation details

**Practice**:
- Test at interface boundaries (HTTP, Pub/Sub, function input/output)
- Do not depend on internal implementation (private methods, internal state)
- Prefer black-box testing

**Examples in this repository**:
- Pub/Sub handler tests: Input a message (JSON) and verify Firestore state changes
- UseCase tests: Replace external dependencies via interfaces (mocks)

```go
// Good: Test at request/response granularity
func TestVideoUseCase_ProcessVideo(t *testing.T) {
    type args struct {
        ctx     context.Context
        videoID string
    }
    type want struct {
        err error
    }
    tests := []struct {
        name   string
        args   args
        want   want
        setup  func(*mockRepo)
    }{
        {
            name: "happy path",
            args: args{ctx: context.Background(), videoID: "video-123"},
            want: want{err: nil},
            setup: func(m *mockRepo) {
                m.GetVideoFunc = func(ctx context.Context, id string) (*Video, error) {
                    return &Video{ID: id}, nil
                }
            },
        },
    }
    // Test only UseCase input/output, do not depend on internal implementation
}

// Bad: Test that depends on internal implementation
func TestVideoUseCase_internalValidation(t *testing.T) {
    // Directly testing a private method
}
```

### Gradual Strictness of Tests

**Purpose**: Don't try to write perfect tests from the start; improve them incrementally

**Practice**:
1. **Phase 1**: Confirm "it's not undefined" and "it doesn't panic"
2. **Phase 2**: Confirm the happy path works
3. **Phase 3**: Add error cases and edge cases
4. **Phase 4**: Add exact-match assertions

**Example**:
```go
// Phase 1: First, confirm it runs
func TestProcessVideo_DoesNotPanic(t *testing.T) {
    uc := &VideoUseCase{repo: &mockRepo{}}
    _ = uc.ProcessVideo(context.Background(), "video-id")
    // Ignore errors; OK as long as it doesn't panic
}

// Phase 2: Confirm happy path works
func TestProcessVideo_Success(t *testing.T) {
    uc := &VideoUseCase{repo: &mockRepo{}}
    err := uc.ProcessVideo(context.Background(), "video-id")
    if err != nil {
        t.Fatal("expected no error")
    }
}

// Phase 3: Add error cases
func TestProcessVideo_ErrorCases(t *testing.T) {
    tests := []struct {
        name    string
        videoID string
        wantErr bool
    }{
        {name: "empty string", videoID: "", wantErr: true},
        {name: "invalid ID", videoID: "invalid", wantErr: true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            uc := &VideoUseCase{repo: &mockRepo{}}
            err := uc.ProcessVideo(context.Background(), tt.videoID)
            if (err != nil) != tt.wantErr {
                t.Errorf("wantErr %v, got %v", tt.wantErr, err)
            }
        })
    }
}

// Phase 4: Verify exact match
func TestProcessVideo_ExactMatch(t *testing.T) {
    type args struct {
        ctx     context.Context
        videoID string
    }
    type want struct {
        video *Video
        err   error
    }
    tests := []struct {
        name  string
        args  args
        want  want
        setup func(*mockRepo)
    }{
        {
            name: "happy path",
            args: args{ctx: context.Background(), videoID: "video-123"},
            want: want{
                video: &Video{ID: "video-123", Title: "Test Video"},
                err:   nil,
            },
            setup: func(m *mockRepo) {
                m.GetVideoFunc = func(ctx context.Context, id string) (*Video, error) {
                    return &Video{ID: "video-123", Title: "Test Video"}, nil
                }
            },
        },
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            m := &mockRepo{}
            tt.setup(m)
            uc := &VideoUseCase{repo: m}
            got, err := uc.ProcessVideo(tt.args.ctx, tt.args.videoID)

            if diff := cmp.Diff(tt.want, want{video: got, err: err}, cmpopts.AnyError); diff != "" {
                t.Fatalf("mismatch (-want +got):\n%s", diff)
            }
        })
    }
}
```

**For legacy code improvement**:
- If there are no existing tests, start from Phase 1
- If tests exist, start from Phase 2 and gradually progress to Phase 4
- Add exact-match assertions last, using them as verification during refactoring

---

## Go-Specific Implementation Guidelines

### Value Object Template

```go
// MyValueObject is a value object representing [description]
type MyValueObject string

// ParseMyValueObject validates raw and creates a MyValueObject
func ParseMyValueObject(raw string) (MyValueObject, error) {
    v := strings.TrimSpace(raw)
    if v == "" {
        return "", xerr.New("myValueObject is empty")
    }
    // Additional validation rules
    return MyValueObject(v), nil
}

func (o MyValueObject) String() string { return string(o) }
```

### Type-Safe State Transition Representation

Define each state as an independent type, and transition methods return the target state's type:

```go
type ProcessState interface {
    Name() string
}

type ProcessPending struct{}
func (ProcessPending) Name() string { return "pending" }
func (ProcessPending) Start() ProcessRunning { return ProcessRunning{} }

type ProcessRunning struct{}
func (ProcessRunning) Name() string { return "running" }
func (ProcessRunning) Succeed() ProcessSuccess { return ProcessSuccess{} }
func (ProcessRunning) Fail() ProcessFailed { return ProcessFailed{} }

type ProcessSuccess struct{}
func (ProcessSuccess) Name() string { return "success" }

type ProcessFailed struct{}
func (ProcessFailed) Name() string { return "failed" }
```

### Enumeration Types for State Management

**Purpose**: Eliminate the possibility of unexpected values entering by using enumeration types instead of string constants

Go lacks an enum keyword like other languages, but enumeration types can be achieved using constant definitions with `iota`.

#### Comparison with String Constants

```go
// Bad: String constants cannot detect typos or undefined values
const (
    StatusPending = "pending"
    StatusRunning = "running"
    StatusSuccess = "success"
)

func Process(status string) error {
    if status == "pendng" { // Typo goes unnoticed
        // ...
    }
    // Any arbitrary string can be passed
}

// Good: Enumeration types restrict possible values
type Status int

const (
    StatusPending Status = iota
    StatusRunning
    StatusSuccess
)

func Process(status Status) error {
    if status == StatusPending {
        // Type-checked at compile time
    }
    // Only Status type values can be passed
}
```

#### Example in this repository: PlatformKind

```go
// PlatformKind is an enumeration type representing streaming platforms
type PlatformKind int

const (
    YouTube PlatformKind = iota
    Twitch
    NicoNico
)

// String conversion
func (p PlatformKind) String() string {
    switch p {
    case YouTube:
        return "youtube"
    case Twitch:
        return "twitch"
    case NicoNico:
        return "niconico"
    default:
        return "unknown"
    }
}

// Parsing from string
func ParsePlatformKind(s string) (PlatformKind, error) {
    switch s {
    case "youtube":
        return YouTube, nil
    case "twitch":
        return Twitch, nil
    case "niconico":
        return NicoNico, nil
    default:
        return 0, xerr.New("unknown platform: " + s)
    }
}
```

#### Benefits

1. **Type safety**: Checked at compile time
2. **Autocompletion**: IDE displays candidates
3. **Exhaustive check**: Switch statement exhaustiveness checking is possible (golangci-lint's `exhaustive` rule)
4. **Prevents typos**: Undefined values cannot be passed

#### Caveats

- `String()` and `Parse*` methods are needed for JSON/DB interconversion
- `iota` starts at 0, so handle the zero value with care

### Error Handling

- Generate domain errors with `xerr`
- Error messages should explicitly state "what" failed and "why"
- Include information that allows the caller to make decisions

```go
// Good: Specific error message
if v == "" {
    return "", xerr.New("videoId is empty")
}

// Bad: Vague error message
if v == "" {
    return "", xerr.New("invalid input")
}
```

---

## Automated Checking Tools

The following tools mechanically check adherence to the design guidelines:

| Tool | What It Checks |
|--------|-------------|
| `go-arch-lint` | Clean Architecture dependency direction (defined in `.go-arch-lint.yml`) |
| `usecasegodoc` | Idempotency GoDoc on UseCase public methods |
| `valueobject` | Constructor validation and prevention of direct initialization for value objects |
| `tabletest` | Table-driven test format (`args/want` structs, `cmp.Diff` usage) |

### How to Run

```bash
make lint
```

All lint tools are run automatically.

### valueobject lint

**Purpose**: Prevent direct use of primitive types and validate invariants in value object constructors

**What it checks**:
- Whether `Parse*` / `New*` functions return `error`
- Detects direct initialization of value object types (`VideoID`, `PlatformKind`, etc.)

**Example**:
```go
// NG: Direct initialization
videoID := VideoID("abc123")

// OK: Via constructor
videoID, err := ParseVideoID("abc123")
```

### tabletest lint

**Purpose**: Enforce t-wada's recommended table-driven test format

**What it checks**:
- Whether `Test*` functions in `*_test.go` use `args` and `want` structs
- Whether comparisons use `cmp.Diff` (`reflect.DeepEqual` is prohibited)

**Example**:
```go
// OK
type args struct { raw string }
type want struct { Got VideoID; Err error }
tests := []struct { name string; args args; want want }{ ... }

// Comparison
if diff := cmp.Diff(tt.want, got); diff != "" {
    t.Fatalf("mismatch (-want +got):\n%s", diff)
}
```

---

## Checklist

Verify the following during code review:

- [ ] Are value objects used instead of primitive types?
- [ ] Are invariants validated in constructors?
- [ ] Are state changes made through explicit methods?
- [ ] Are DTOs and Domain types separated?
- [ ] Does new code have tests?
- [ ] Are external dependencies injectable as arguments?

---

## t-wada's Core Messages

The message common to both session materials ("The True Record of Legacy Code Improvement" and "Growing Reliable Code") can be summarized in the following two points.

### 1. Accelerating Feedback Cycles

**Rapid feedback through testing and automation**:
- Make change history trackable with version control (Git)
- Run automated tests and lint via CI/CD to detect problems early
- Code without tests is "bad code" and leads to becoming legacy code
- Start with rough tests that confirm the happy path works, even if imperfect

**Effects**:
- Significantly reduce fix costs through early bug detection
- Improve safety during refactoring, accelerating code improvement
- Developers can change code with confidence

### 2. Controlling Complexity Through Design

**Preventive design through types and separation of responsibilities**:
- Use the type system to eliminate invalid values, making defensive programming (excessive if-statements) unnecessary
- Minimize the state space with enumeration types and value objects
- Place responsibilities in appropriate objects to increase cohesion
- Fundamentally prevent aliasing problems through immutability

**Effects**:
- Detect errors at compile time, reducing runtime errors
- Code intent becomes clearer, improving maintainability
- The scope of what needs testing is reduced, making quality assurance easier

### The Key to Increasing Code Reliability and Development Sustainability

By combining these two approaches (**accelerating feedback cycles** and **controlling complexity through design**):

- **Short-term**: Early bug detection and fixing becomes possible, improving development speed
- **Medium-term**: Refactoring becomes safe, enabling technical debt repayment
- **Long-term**: A sustainable development system is established, enabling flexible adaptation to new feature additions and team member turnover

**Conclusion**:
> The most important thing in both legacy code improvement and new development is to increase code reliability and make development sustainable through the twin wheels of "testing and automation" and "types and design."
