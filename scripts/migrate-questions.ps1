# 問題ファイルを新形式に移行するスクリプト
# 使用方法: .\migrate-questions.ps1 -TopicId "03_operators"

param(
    [Parameter(Mandatory=$true)]
    [string]$TopicId
)

$baseDir = "C:\Users\hashi\workspace\curriculum\programming-bootcamp\docs\src\questions"

# トピックごとのquestionIdマッピング
$questionMappings = @{
    "03_operators" = @(
        "arithmetic_operators_concept",
        "comparison_operators_concept",
        "logical_operators_concept",
        "increment_decrement_concept",
        "basic_arithmetic",
        "modulo_operation",
        "integer_division_result",
        "compound_assignment",
        "value_comparison",
        "combine_conditions",
        "negate_condition",
        "increment_decrement_value",
        "read_calculation_result"
    )
    "04_if_statement" = @(
        "conditional_branch_concept",
        "if_syntax_basics",
        "if_else_vs_elseif",
        "switch_vs_if",
        "simple_if_statement",
        "if_else_statement",
        "if_elseif_else_statement",
        "complex_conditions",
        "switch_statement",
        "switch_break_role",
        "read_conditional_code",
        "conditional_by_value"
    )
    "05_loops" = @(
        "loop_concept",
        "for_loop_syntax",
        "while_vs_dowhile",
        "break_vs_continue",
        "infinite_loop_concept",
        "for_loop_repeat",
        "for_loop_1_to_10",
        "while_loop",
        "do_while_loop",
        "break_statement",
        "continue_statement",
        "nested_loop",
        "read_loop_count"
    )
    "06_arrays" = @(
        "array_concept",
        "array_index_concept",
        "array_declaration_initialization",
        "array_length",
        "create_array",
        "get_array_element",
        "loop_array_elements",
        "enhanced_for_loop",
        "array_sum_average",
        "array_max_min",
        "two_dimensional_array"
    )
}

if (-not $questionMappings.ContainsKey($TopicId)) {
    Write-Error "トピック $TopicId のマッピングが見つかりません"
    exit 1
}

$questionIds = $questionMappings[$TopicId]

# トピックのディレクトリパスを特定
$topicPath = Get-ChildItem -Path $baseDir -Recurse -Directory -Filter $TopicId | Select-Object -First 1

if (-not $topicPath) {
    Write-Error "トピック $TopicId のディレクトリが見つかりません"
    exit 1
}

Write-Host "トピック: $TopicId" -ForegroundColor Green
Write-Host "パス: $($topicPath.FullName)" -ForegroundColor Cyan

# 既存ファイルを取得（旧形式）
$existingFiles = Get-ChildItem -Path $topicPath.FullName -Filter "*.mdx" | Sort-Object Name

Write-Host "`n既存ファイル数: $($existingFiles.Count)" -ForegroundColor Yellow
Write-Host "期待される問題数: $($questionIds.Count)" -ForegroundColor Yellow

if ($existingFiles.Count -ne $questionIds.Count) {
    Write-Warning "ファイル数と問題数が一致しません！"
}

# リネームマッピングを作成
$renameMapping = @{}
for ($i = 0; $i -lt [Math]::Min($existingFiles.Count, $questionIds.Count); $i++) {
    $oldName = $existingFiles[$i].Name
    $newName = "$($questionIds[$i]).mdx"
    $renameMapping[$oldName] = $newName
}

Write-Host "`n=== リネーム計画 ===" -ForegroundColor Magenta
$renameMapping.GetEnumerator() | ForEach-Object {
    Write-Host "$($_.Key) -> $($_.Value)"
}

$confirm = Read-Host "`n実行しますか? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "キャンセルされました" -ForegroundColor Red
    exit 0
}

# ファイルをリネーム
Write-Host "`n=== ファイルリネーム中 ===" -ForegroundColor Green
foreach ($entry in $renameMapping.GetEnumerator()) {
    $oldPath = Join-Path $topicPath.FullName $entry.Key
    $newPath = Join-Path $topicPath.FullName $entry.Value
    Move-Item -Path $oldPath -Destination $newPath
    Write-Host "✓ $($entry.Key) -> $($entry.Value)"
}

# frontmatterを更新
Write-Host "`n=== frontmatter更新中 ===" -ForegroundColor Green
$category = if ($topicPath.FullName -match "java") { "java/basics" } 
            elseif ($topicPath.FullName -match "spring") { "spring" }
            else { "frontend" }

foreach ($questionId in $questionIds) {
    $filePath = Join-Path $topicPath.FullName "$questionId.mdx"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $newId = "$category/$TopicId#$questionId"
        $content = $content -replace 'id: "[^"]+\"', "id: \`"$newId\`""
        Set-Content $filePath $content -NoNewline
        Write-Host "✓ $questionId.mdx の id を更新"
    }
}

Write-Host "`n完了！" -ForegroundColor Green
