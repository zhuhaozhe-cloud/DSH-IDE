@echo off
REM DSH-IDE 重新上传脚本 (Windows)
REM DSH-IDE Re-upload Script (Windows)

echo ========================================
echo   DSH-IDE 重新上传脚本
echo   DSH-IDE Re-upload Script
echo ========================================
echo.

REM 检查Git状态
echo 检查Git状态...
git status

echo.
echo 提交历史：
git log --oneline

echo.
echo 远程仓库配置：
git remote -v

echo.
echo 准备重新上传到 GitHub...
echo 仓库地址：https://github.com/zhuhaozhe-cloud/DSH-IDE
echo.

REM 检查是否有未提交的更改
git status --porcelain > temp.txt
if %errorlevel% equ 0 (
    if exist temp.txt (
        for /f %%i in (temp.txt) do set size=%%~zi
        if %size% gtr 0 (
            echo 发现未提交的更改，正在提交...
            git add .
            git commit -m "feat: 更新项目文件"
            echo ✓ 更改已提交
        ) else (
            echo ✓ 没有未提交的更改
        )
    )
) else (
    echo ✓ 没有未提交的更改
)

del temp.txt 2>nul

REM 推送到GitHub
echo.
echo 正在推送到 GitHub...
echo 仓库地址：https://github.com/zhuhaozhe-cloud/DSH-IDE
echo 分支：master
echo.

git push origin master

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   重新上传成功！
    echo   Re-upload Successful!
    echo ========================================
    echo.
    echo 项目已成功上传到 GitHub：
    echo https://github.com/zhuhaozhe-cloud/DSH-IDE
    echo.
    echo 接下来您可以：
    echo 1. 访问 GitHub 仓库查看项目
    echo 2. 配置仓库设置
    echo 3. 分享项目链接
    echo 4. 开始推广项目
    echo.
) else (
    echo.
    echo ========================================
    echo   上传失败
    echo   Upload Failed
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub 认证失败
    echo 3. 仓库不存在或没有权限
    echo.
    echo 请尝试以下解决方案：
    echo 1. 检查网络连接
    echo 2. 重新配置 GitHub 认证
    echo 3. 手动执行：git push origin master
    echo.
)

echo.
echo 项目文件统计：
for /f %%i in ('dir /s /b /a-d ^| find /c /v ""') do set file_count=%%i
echo 总文件数：%file_count%

for /f %%i in ('dir /s /b /ad ^| find /c /v ""') do set dir_count=%%i
echo 总文件夹数：%dir_count%

echo.
echo 提交统计：
for /f %%i in ('git log --oneline ^| find /c /v ""') do set commit_count=%%i
echo 总提交数：%commit_count%

echo 最新提交：
git log -1 --pretty=format:"%%h %%s"
echo.

pause
