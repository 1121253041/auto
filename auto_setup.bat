@echo off
  setlocal
  set ROOT=D:\create\auto

  if not exist "%ROOT%" mkdir "%ROOT%"

  > "%ROOT%\tasks.txt" (
  echo # 任务列表（[ ] 未完成, [x] 已完成）
  echo.
  echo [ ] 搭建项目初始化脚本
  echo [ ] 实现核心功能A
  echo [ ] 补充测试
  echo [ ] 更新文档
  )

  > "%ROOT%\progress.txt" (
  echo # 工作日志（按时间追加）
  echo.
  echo - 2026-03-06 10:00:00 初始化项目
  )

  > "%ROOT%\guide.md" (
  echo # 开发规范与流程
  echo.
  echo 你是项目中的自动化开发 AI。每次运行请严格执行：
  echo 1. 先运行项目初始化脚本（若存在）。
  echo 2. 从 tasks.txt 领取一个“[ ]”任务。
  echo 3. 完成开发实现。
  echo 4. 运行测试和验证。
  echo 5. 更新 progress.txt（记录完成/失败原因）并更新 tasks.txt 状态。
  echo 6. 提交 Git commit（小步提交，信息清晰）。
  echo 7. 若遇到阻塞问题，明确写入 progress.txt 并停止。
  echo.
  echo 注意：
  echo - 一次运行只处理一个任务。
  echo - 若没有可领取任务，输出：NO_TASK
  echo - 不要跳过测试与日志更新。
  )

  > "%ROOT%\run_claude_loop.sh" (
  echo #!/usr/bin/env bash
  echo set -euo pipefail
  echo.
  echo if [[ $# -ne 1 ]]; then
  echo   echo "用法: $0 ^<调用次数^>"
  echo   exit 1
  echo fi
  echo RUNS="$1"
  echo ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" ^&^& pwd)"
  echo cd "$ROOT_DIR"
  echo mkdir -p logs
  echo LOG_FILE="logs/orchestrator_$(date +%%Y%%m%%d_%%H%%M%%S).log"
  echo.
  echo log^(^) { echo "[`date '+%%F %%T'`] $1" ^| tee -a "$LOG_FILE"; }
  echo.
  echo read -r -d '' BASE_PROMPT ^<^<'EOF' ^|^| true
  echo 请按以下流程执行一次完整开发循环：
  echo 1^) 阅读 guide.md
  echo 2^) 从 tasks.txt 领取一个未完成任务（[ ]）
  echo 3^) 完成开发
  echo 4^) 运行测试并验证
  echo 5^) 更新 progress.txt 与 tasks.txt
  echo 6^) 提交 git commit
  echo 若没有任务请输出：NO_TASK
  echo EOF
  echo.
  echo invoke_claude^(^) {
  echo   claude code --permission-mode bypassPermissions --prompt "$1"
  echo }
  echo.
  echo for ((i=1; i^<=RUNS; i++)); do
  echo   log "第 $i/$RUNS 轮开始"
  echo   output="$(invoke_claude "$BASE_PROMPT" 2^>^&1)" ^|^| true
  echo   echo "$output" ^| tee -a "$LOG_FILE" ^> "logs/round_${i}.log"
  echo   if echo "$output" ^| grep -q "NO_TASK"; then
  echo     log "无任务，结束"
  echo     break
  echo   fi
  echo done
  )

  echo 已生成到 %ROOT%
  dir "%ROOT%"
  pause