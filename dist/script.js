const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

canvas.width = 500;
canvas.height = 600;

let plane, bullets, enemies, score, health, isGameOver;

function initGame() {
    plane = { x: 225, y: 500, width: 50, height: 50 };
    bullets = [];
    enemies = [];
    score = 0;
    health = 3;  // 血量
    isGameOver = false;
    restartBtn.style.display = "none";
    update();
}

// 監聽鍵盤事件，改為 WASD 控制
document.addEventListener("keydown", (event) => {
    if (event.key === "a" && plane.x > 0) {  // 左移
        plane.x -= 20;
    } else if (event.key === "d" && plane.x < canvas.width - plane.width) {  // 右移
        plane.x += 20;
    } else if (event.key === "w" && plane.y > 0) {  // 上移
        plane.y -= 20;
    } else if (event.key === "s" && plane.y < canvas.height - plane.height) {  // 下移
        plane.y += 20;
    } else if (event.key === " ") {  // 發射子彈
        bullets.push({ x: plane.x + 20, y: plane.y, width: 10, height: 20 });
    }
});

// 生成敵人
function spawnEnemy() {
    let x = Math.random() * (canvas.width - 40);
    enemies.push({ x: x, y: 0, width: 40, height: 40 });
}

setInterval(spawnEnemy, 1000);

function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 畫飛機
    ctx.fillStyle = "white";
    ctx.fillRect(plane.x, plane.y, plane.width, plane.height);

    // 更新子彈
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // 更新敵人
    enemies.forEach((enemy, index) => {
        enemy.y += 3;
        ctx.fillStyle = "blue";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // 子彈擊中敵人
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(index, 1);
                score++;
            }
        });

        // 敌机撞到飛機
        if (
            plane.x < enemy.x + enemy.width &&
            plane.x + plane.width > enemy.x &&
            plane.y < enemy.y + enemy.height &&
            plane.y + plane.height > enemy.y
        ) {
            enemies.splice(index, 1);
            health--;  // 扣血

            if (health <= 0) {
                gameOver();
            }
        }

        // 移除超出畫面的敵人
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // 顯示分數與血量
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("分數: " + score, 10, 30);
    ctx.fillText("血量: " + health, 10, 60);

    requestAnimationFrame(update);
}

// 遊戲結束
function gameOver() {
    isGameOver = true;
    alert("遊戲結束！你的得分：" + score);
    restartBtn.style.display = "inline-block";
}

// 重新開始遊戲
function restartGame() {
    initGame();
}

initGame();