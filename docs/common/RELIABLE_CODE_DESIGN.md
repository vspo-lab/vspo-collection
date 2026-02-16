# 信頼性の高いコード設計ガイドライン

本ドキュメントは、誤りにくい設計を志向するための原則と Go での実装パターンをまとめる。t-wada 氏の講演資料から得られた知見を Go 言語の文脈で具体化したものである。

## 設計原則

### 1. 型による防御（Defense by Types）

**目的**: 不正な値がシステムに入り込むことをコンパイル時に防ぐ

**実践**:
- プリミティブ型（`string`, `int`）を直接使わず、意味のある値オブジェクト型を定義する
- ドメイン固有の制約を型で表現する
- 無効な状態を表現できない型設計を目指す

**本リポジトリでの例**:
- `VideoID`, `CreatorID` - 文字列 ID の意味を型で明示
- `PlatformKind` - 許可されたプラットフォームのみを表現
- `ProcessState` - 有効な状態遷移のみを許可

### 2. イミュータビリティの追求

**目的**: 予期しない状態変更を防ぎ、コードの理解を容易にする

**実践**:
- 構造体フィールドは非公開にし、getter を提供する
- 状態変更メソッドは新しい値を返すか、明示的にポインタレシーバを使う
- 副作用のある操作はメソッド名で明示する

**本リポジトリでの例**:
- `ProcessState.Start()` は新しい状態を返す
- `Video.StartJob()` はポインタレシーバで明示的に変更

#### エイリアシング問題の防止

**エイリアシング問題とは**:
複数の変数が同じメモリ領域を参照している状態で、一方の変更が他方に意図せず影響を及ぼす問題。

**不変オブジェクトによる解決**:
- オブジェクトの状態を変更しない設計にすることで、エイリアシングによる予期しない副作用を根本的に防ぐ
- 値を変更したい場合は、新しいオブジェクトを生成して返す

**例**:
```go
// Bad: ミュータブルな設計（エイリアシング問題が発生）
type Config struct {
    MaxRetry int
}

func (c *Config) SetMaxRetry(n int) {
    c.MaxRetry = n  // 参照先が共有されていると、意図しない変更が波及する
}

func main() {
    cfg1 := &Config{MaxRetry: 3}
    cfg2 := cfg1  // 同じポインタを共有（エイリアシング）
    cfg2.SetMaxRetry(10)
    fmt.Println(cfg1.MaxRetry)  // 10 - cfg1も変更されてしまう
}

// Good: イミュータブルな設計
type Config struct {
    maxRetry int  // 非公開フィールド
}

func (c Config) MaxRetry() int {
    return c.maxRetry
}

func (c Config) WithMaxRetry(n int) Config {
    return Config{maxRetry: n}  // 新しいインスタンスを返す
}

func main() {
    cfg1 := Config{maxRetry: 3}
    cfg2 := cfg1.WithMaxRetry(10)  // 新しいインスタンスが生成される
    fmt.Println(cfg1.MaxRetry())    // 3 - cfg1は変更されない
    fmt.Println(cfg2.MaxRetry())    // 10
}
```

**Goにおける注意点**:
- スライスやマップはポインタのように振る舞うため、コピーしても内部データは共有される
- 深いコピーが必要な場合は、明示的にコピー関数を実装する
- 値レシーバ（`func (c Config)`）と値渡しを活用して、暗黙的なコピーを促す

### 3. コンストラクタでの不変条件検証

**目的**: 不正な状態のオブジェクトが生成されることを防ぐ

**実践**:
- すべての `New*` / `Parse*` 関数で入力を検証する
- 検証に失敗した場合は error を返す
- ゼロ値が有効な状態でない場合は必ずコンストラクタを経由させる

**本リポジトリでの例**:
- `ParseVideoID` - 空文字を拒否
- `ParseProcessState` - 未知の状態を拒否
- `video.New` - 必須フィールドを検証

### 4. 事実と情報の分離

**目的**: データの解釈をドメイン層に集約し、変換ミスを防ぐ

**実践**:
- 外部から受け取る生データは DTO として表現（事実）
- ドメインロジックで使う型は Domain 型として定義（情報）
- 変換はアダプタ層で一箇所に集約する

**本リポジトリでの例**:
- `infra/*/internal/dto/` - Firestore/Pub/Sub のペイロード（事実）
- `domain/video/Video` - ビジネスロジックで使う型（情報）

### 5. 不正な状態を表現不可能にする

**目的**: 防御的プログラミング（大量のif文）ではなく、設計で不正な値を排除する

**実践**:
- 型システムで取り得る値の組み合わせ（状態空間）を最小化する
- プリミティブ型を避け、ドメイン固有の型を定義する
- 無効な状態を表現できない型設計を目指す

**本リポジトリでの例**:
- `ProcessState` インターフェースで状態を型で表現
- `PlatformKind` で許可されたプラットフォームのみを表現
- 値オブジェクトで不正な値の生成を防止

**アンチパターン**:
```go
// Bad: 文字列で状態管理
type Video struct {
    Status string // "pending", "running", "success", "failed" などが混在
}

// Good: 型で状態管理
type ProcessState interface {
    Name() string
}
type ProcessPending struct{}
type ProcessRunning struct{}
```

### 6. 静的解析の活用

**目的**: テストだけでなく、lintツールで事前にバグを検出する

**実践**:
- `golangci-lint` で一般的なコード品質をチェック
- カスタムlintで設計ルールを機械的にチェック（`go-arch-lint`, `usecasegodoc`, `valueobject`, `tabletest`）
- CI/CD で自動実行し、違反を防止

**本リポジトリでの例**:
- `.go-arch-lint.yml` で Clean Architecture 依存方向を強制
- `valueobject` lint で値オブジェクトの直接初期化を検出
- `tabletest` lint でテーブルドリブンテスト形式を強制

### 7. 完全性（Integrity）の保証

**目的**: オブジェクトが生成された時点で、常に整合性が取れた状態であることを保証する

**実践**:
- コンストラクタで全ての不変条件を検証する
- 部分的に初期化されたオブジェクトを公開しない
- setter を避け、不変オブジェクトを優先する

**本リポジトリでの例**:
```go
// 完全性を保証するコンストラクタ
func New(platform platform.PlatformKind, videoID, creatorID string) (*Video, error) {
    vid, err := ParseVideoID(videoID)
    if err != nil {
        return nil, err
    }
    cid, err := ParseCreatorID(creatorID)
    if err != nil {
        return nil, err
    }
    // 生成された時点で全フィールドが有効
    return &Video{
        Platform:  platform,
        VideoID:   vid,
        CreatorID: cid,
    }, nil
}
```

### 8. 適切な責務の配置

**目的**: チェックロジックを適切なオブジェクトに配置し、凝集度を高める

**実践**:
- 「開始日が終了日より前」のチェックは `DateTimeRange` の責務
- 「プロセスが実行可能か」のチェックは `ProcessState` の責務
- ドメインルールはドメインオブジェクトに閉じる

**本リポジトリでの例**:
```go
// Bad: 利用側でチェック
func (uc *UseCase) Process(ctx context.Context) error {
    if state.Name() != "pending" {
        return errors.New("not pending")
    }
    // ...
}

// Good: 状態オブジェクト自身がチェック
type ProcessPending struct{}
func (ProcessPending) Start() ProcessRunning {
    // 開始可能な状態であることを型で保証
    return ProcessRunning{}
}
```

---

## レガシーコード改善戦略

### 優先順位

レガシーコードを改善する際は、以下の順序で取り組む:

1. **バージョン管理**: 変更履歴を追跡可能にする（git）
2. **自動化**: `make lint && make test` を必ず通す状態を作る
3. **テスティング**: 段階的にカバレッジを上げる

### 開発の3本柱の確立

レガシーコード改善において、以下の3つの柱を確立することが成功の鍵となる。

#### 1. バージョン管理（Git）

**重要度**: 最優先事項

**理由**:
- バージョン管理なしでの開発は**極めて危険**
- 変更履歴がないと、誰がいつ何を変更したかが追跡不可能
- ロールバックや差分確認ができない状態は、本番環境での事故に直結する

**実践**:
- レガシーコードを引き継いだら、最初に Git リポジトリを作成する
- コミットメッセージは明確に記述する（Angular スタイルを推奨）
- ブランチ戦略を定義する（例: main/develop/feature ブランチ）

#### 2. 自動化（Automation）

**重要度**: 早期導入がレバレッジを生む

**理由**:
- 手作業によるデプロイやビルドは、ミスが発生しやすく時間もかかる
- 自動化を早期に導入すると、以降のすべての開発でその恩恵を受けられる
- CI/CD パイプラインは開発速度と品質の両方を向上させる

**実践**:
- `Makefile` や `scripts/` でビルド・テストを自動化する
- GitHub Actions や CI ツールで自動テスト・lint を実行する
- デプロイプロセスを自動化し、人為的ミスを排除する

**本リポジトリでの例**:
```bash
make lint   # 静的解析を自動実行
make test   # ユニットテストを自動実行
make ci     # CI 相当の処理を自動実行
```

#### 3. 自動テスト（Testing）

**重要度**: テストのないコードは「悪いコード」

**定義** (マイケル・フェザーズ):
> "テストのないコードはレガシーコードである"

**理由**:
- 手動確認は不安定で、コストが高く、属人化しやすい
- テストがあれば、リファクタリング時に既存の動作が保たれているか自動検証できる
- まずは「正常系（Happy Path）」が動くことを確認する簡単なテストから始めても価値がある

**実践**:
- 既存コードには「undefinedでないこと」や「panicしないこと」を確認する程度の雑なテストから始める
- 新規コードはテストファーストで書く（Sprout パターン）
- テストカバレッジを段階的に上げていく

**テストの段階**:
1. Phase 1: panic しないこと
2. Phase 2: 正常系が動くこと
3. Phase 3: 異常系とエッジケース
4. Phase 4: 完全一致の検証（詳細は「テスト戦略」セクション参照）

### Extract パターン

既存コードからテスト可能な純粋関数を抽出する:

1. テストしたいロジックを特定する
2. 外部依存（I/O、時刻、乱数）を引数として受け取る形に変形する
3. 純粋関数として切り出す
4. 単体テストを追加する
5. 元の場所から切り出した関数を呼び出す

```go
// Before: テスト困難
func ProcessOrder(orderID string) error {
    order := db.GetOrder(orderID)  // 外部依存
    if time.Now().After(order.Deadline) {  // 時刻依存
        return errors.New("deadline exceeded")
    }
    // ...
}

// After: 純粋関数を抽出
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

### Sprout パターン

新規コードはテストファーストで書く:

1. 新機能の要件を明確にする
2. テストを先に書く（red）
3. 最小限の実装でテストを通す（green）
4. リファクタリングする（refactor）
5. 既存コードとの統合点は最小限にする

```go
// Step 1: テストを先に書く
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

// Step 2: 最小限の実装
func CalculateDiscount(price, quantity int) int {
    if quantity >= 10 {
        return price * quantity * 9 / 10
    }
    return price * quantity
}
```

### 段階的改善プロセス

レガシーコードを引き継いだ際、以下の4つのステップで段階的に改善していく。

#### Step 1: 現状確認と環境整備

**目的**: 改善の土台を作る

**実施内容**:
1. **Git導入**: バージョン管理を最優先で導入する
2. **CI化**: GitHub Actions等でlint・テストを自動実行する環境を整備する
3. **現状把握**: コードベース全体を読み、依存関係や構造を理解する
4. **ドキュメント作成**: README、アーキテクチャ図など最小限のドキュメントを用意する

**注意点**:
- この段階では、コードの大幅な変更は行わない
- まず「守り」の体制（バージョン管理・自動化）を整える

#### Step 2: モデル分離とロジック切り出し

**目的**: ビジネスロジックとハンドラーを分離する

**実施内容**:
1. **モデル定義**: ドメインエンティティや値オブジェクトを定義する
2. **Extract パターン適用**: ハンドラーやコントローラーから純粋関数を抽出する
3. **テスト追加**: 抽出した関数に対してユニットテストを追加する

**例**:
```go
// Before: HTTPハンドラーにビジネスロジックが混在
func HandleOrder(w http.ResponseWriter, r *http.Request) {
    orderID := r.URL.Query().Get("id")
    order := db.GetOrder(orderID)
    if time.Now().After(order.Deadline) {
        http.Error(w, "deadline exceeded", 400)
        return
    }
    // ...
}

// After: ロジックを分離
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

#### Step 3: 事実と解釈の分離

**目的**: データの変換ミスを防ぎ、ドメインロジックを明確にする

**実施内容**:
1. **DTO定義**: 外部から受け取る生データ（JSON、DBレコード等）をDTOとして定義する
2. **Domain型定義**: ビジネスロジックで使う型をドメインモデルとして定義する
3. **変換層の確立**: DTO → Domain の変換をアダプタ層で一箇所に集約する

**本リポジトリでの例**:
- `infra/*/internal/dto/` - Firestore/Pub/Sub のペイロード（**事実**）
- `domain/video/Video` - ビジネスロジックで使う型（**情報**）

詳細は「設計原則 4. 事実と情報の分離」を参照。

#### Step 4: アーキテクチャ定義

**目的**: 持続可能な開発を実現する設計を確立する

**実施内容**:
1. **アーキテクチャパターンの選定**: Clean Architecture、Hexagonal Architecture等を選択する
2. **依存方向の明確化**: 外側（Infra）→内側（Domain）の一方向依存を徹底する
3. **自動チェックの導入**: `go-arch-lint`等で依存方向違反を自動検出する
4. **ドキュメント化**: `docs/ARCHITECTURE.md`等にアーキテクチャ決定を記録する

**本リポジトリでの例**:
- Clean Architecture + DDD を採用
- `.go-arch-lint.yml` で依存方向を強制
- `docs/ARCHITECTURE_RULES.md` でルールを文書化

---

## テスト戦略

### リクエスト/レスポンスの粒度を狙う

**目的**: 実装の細部と距離を置くことで、リファクタリングに強いテストを書く

**実践**:
- インターフェース境界（HTTP、Pub/Sub、関数の入出力）でテストする
- 内部実装（private メソッド、内部状態）に依存しない
- ブラックボックステストを優先する

**本リポジトリでの例**:
- Pub/Sub ハンドラのテスト: メッセージ（JSON）を入力し、Firestore の状態変化を確認
- UseCase のテスト: インターフェース（mock）経由で外部依存を差し替え

```go
// Good: リクエスト/レスポンスの粒度でテスト
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
            name: "正常系",
            args: args{ctx: context.Background(), videoID: "video-123"},
            want: want{err: nil},
            setup: func(m *mockRepo) {
                m.GetVideoFunc = func(ctx context.Context, id string) (*Video, error) {
                    return &Video{ID: id}, nil
                }
            },
        },
    }
    // UseCase の入出力のみをテスト、内部実装には依存しない
}

// Bad: 内部実装に依存するテスト
func TestVideoUseCase_internalValidation(t *testing.T) {
    // private メソッドを直接テスト
}
```

### 段階的なテストの厳密化

**目的**: 完璧なテストを最初から書こうとせず、段階的に改善する

**実践**:
1. **Phase 1**: 「undefined でないこと」「panic しないこと」を確認
2. **Phase 2**: 正常系（Happy Path）の動作を確認
3. **Phase 3**: 異常系とエッジケースを追加
4. **Phase 4**: 完全一致のアサーションを追加

**例**:
```go
// Phase 1: まず動くことを確認
func TestProcessVideo_DoesNotPanic(t *testing.T) {
    uc := &VideoUseCase{repo: &mockRepo{}}
    _ = uc.ProcessVideo(context.Background(), "video-id")
    // エラーは無視、panicしなければOK
}

// Phase 2: 正常系の動作を確認
func TestProcessVideo_Success(t *testing.T) {
    uc := &VideoUseCase{repo: &mockRepo{}}
    err := uc.ProcessVideo(context.Background(), "video-id")
    if err != nil {
        t.Fatal("expected no error")
    }
}

// Phase 3: 異常系を追加
func TestProcessVideo_ErrorCases(t *testing.T) {
    tests := []struct {
        name    string
        videoID string
        wantErr bool
    }{
        {name: "空文字", videoID: "", wantErr: true},
        {name: "不正なID", videoID: "invalid", wantErr: true},
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

// Phase 4: 完全一致を検証
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
            name: "正常系",
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

**レガシーコード改善の場合**:
- 既存のテストがない場合は Phase 1 から始める
- テストがある場合は Phase 2 から始め、段階的に Phase 4 へ進む
- 完全一致のアサーションは最後に追加し、リファクタリング時の検証として活用する

---

## Go 固有の実装指針

### 値オブジェクトのテンプレート

```go
// MyValueObject は [説明] を表す値オブジェクト
type MyValueObject string

// ParseMyValueObject は raw を検証し MyValueObject を生成する
func ParseMyValueObject(raw string) (MyValueObject, error) {
    v := strings.TrimSpace(raw)
    if v == "" {
        return "", xerr.New("myValueObject is empty")
    }
    // 追加の検証ルール
    return MyValueObject(v), nil
}

func (o MyValueObject) String() string { return string(o) }
```

### 状態遷移の型安全な表現

各状態を独立した型として定義し、遷移メソッドは遷移先の型を返す:

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

### 列挙型による状態管理

**目的**: 文字列定数ではなく列挙型を使うことで、想定外の値が入り込む余地をなくす

Goには他言語のようなenumキーワードはないが、`iota`を使った定数定義で列挙型を実現できる。

#### 文字列定数との比較

```go
// Bad: 文字列定数は typo や未定義の値を検出できない
const (
    StatusPending = "pending"
    StatusRunning = "running"
    StatusSuccess = "success"
)

func Process(status string) error {
    if status == "pendng" { // typoに気づかない
        // ...
    }
    // 任意の文字列を渡せてしまう
}

// Good: 列挙型で取り得る値を制限
type Status int

const (
    StatusPending Status = iota
    StatusRunning
    StatusSuccess
)

func Process(status Status) error {
    if status == StatusPending {
        // コンパイル時に型チェックされる
    }
    // Status 型以外は渡せない
}
```

#### 本リポジトリでの例: PlatformKind

```go
// PlatformKind は配信プラットフォームを表す列挙型
type PlatformKind int

const (
    YouTube PlatformKind = iota
    Twitch
    NicoNico
)

// 文字列変換
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

// 文字列からのパース
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

#### 利点

1. **タイプセーフ**: コンパイル時に型チェックされる
2. **補完が効く**: IDEで候補が表示される
3. **Exhaustive check**: switch文での網羅性チェックが可能（golangci-lintの`exhaustive`ルール）
4. **誤入力を防ぐ**: 未定義の値を渡せない

#### 注意点

- JSON/DBとの相互変換には`String()`と`Parse*`メソッドが必要
- `iota`は0から始まるため、ゼロ値の扱いに注意

### エラーハンドリング

- ドメインエラーは `xerr` で生成する
- エラーメッセージは「何が」「なぜ」失敗したかを明示する
- 呼び出し側で判断可能な情報を含める

```go
// Good: 具体的なエラーメッセージ
if v == "" {
    return "", xerr.New("videoId is empty")
}

// Bad: 曖昧なエラーメッセージ
if v == "" {
    return "", xerr.New("invalid input")
}
```

---

## 自動チェックツール

以下のツールで設計ガイドラインを機械的にチェック:

| ツール | チェック内容 |
|--------|-------------|
| `go-arch-lint` | Clean Architecture 依存方向（`.go-arch-lint.yml` で定義） |
| `usecasegodoc` | UseCase 公開メソッドの冪等性 GoDoc 記載 |
| `valueobject` | 値オブジェクトのコンストラクタ検証と直接初期化の防止 |
| `tabletest` | テーブルドリブンテスト形式（`args/want` 構造体、`cmp.Diff` 使用） |

### 実行方法

```bash
make lint
```

すべてのlintツールが自動実行されます。

### valueobject lint

**目的**: プリミティブ型の直接使用を防ぎ、値オブジェクトのコンストラクタで不変条件を検証

**チェック内容**:
- `Parse*` / `New*` 関数が `error` を返すか
- 値オブジェクト型（`VideoID`, `PlatformKind` など）の直接初期化を検出

**例**:
```go
// NG: 直接初期化
videoID := VideoID("abc123")

// OK: コンストラクタ経由
videoID, err := ParseVideoID("abc123")
```

### tabletest lint

**目的**: t-wada推奨のテーブルドリブンテスト形式を強制

**チェック内容**:
- `*_test.go` で `Test*` 関数が `args`, `want` 構造体を使用しているか
- `cmp.Diff` で比較しているか（`reflect.DeepEqual` は禁止）

**例**:
```go
// OK
type args struct { raw string }
type want struct { Got VideoID; Err error }
tests := []struct { name string; args args; want want }{ ... }

// 比較
if diff := cmp.Diff(tt.want, got); diff != "" {
    t.Fatalf("mismatch (-want +got):\n%s", diff)
}
```

---

## チェックリスト

コードレビュー時に以下を確認する:

- [ ] プリミティブ型ではなく値オブジェクトを使用しているか
- [ ] コンストラクタで不変条件を検証しているか
- [ ] 状態変更は明示的なメソッドを通しているか
- [ ] DTO と Domain 型が分離されているか
- [ ] 新規コードにはテストがあるか
- [ ] 外部依存は引数として注入可能か

---

## t-wada 氏の共通メッセージ

両セッション資料（「レガシーコード改善の真実の記録」「信頼性の高いコードを育てる」）に共通するメッセージは、以下の2つである。

### 1. フィードバックサイクルの高速化

**テスト・自動化による迅速なフィードバック**:
- バージョン管理（Git）で変更履歴を追跡可能にする
- CI/CD で自動テスト・lint を実行し、問題を早期に検出する
- テストのないコードは「悪いコード」であり、レガシーコード化を招く
- まずは雑でも良いので、正常系（Happy Path）が動くテストから始める

**効果**:
- バグの早期発見により、修正コストを大幅に削減
- リファクタリング時の安全性が向上し、コードの改善が加速する
- 開発者が自信を持ってコードを変更できる

### 2. 設計による複雑性の制御

**型・責務の分離による予防的設計**:
- 型システムで不正な値を排除し、防御的プログラミング（大量のif文）を不要にする
- 列挙型や値オブジェクトで状態空間を最小化する
- 責務を適切なオブジェクトに配置し、凝集度を高める
- イミュータビリティでエイリアシング問題を根本的に防ぐ

**効果**:
- コンパイル時に誤りを検出し、実行時エラーを減らす
- コードの意図が明確になり、保守性が向上する
- テストすべき範囲が減り、品質保証が容易になる

### コードの信頼性と開発継続性を高める鍵

この2つのアプローチ（**フィードバックサイクルの高速化**と**設計による複雑性の制御**）を組み合わせることで:

- **短期的**: バグの早期発見と修正が可能になり、開発速度が向上する
- **中期的**: リファクタリングが安全に行えるようになり、技術的負債の返済が進む
- **長期的**: 持続可能な開発体制が確立され、新機能の追加やメンバーの入れ替えにも柔軟に対応できる

**結論**:
> 「テスト・自動化」と「型・設計」の両輪で、コードの信頼性を高め、開発を継続可能にすることが、レガシーコード改善と新規開発の両方において最も重要である。

