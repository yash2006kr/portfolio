  // Futuristic Snake — Single file
  // Key design goals: smooth canvas rendering, efficient updates, small allocations

  (()=>{
    const canvas = document.getElementById('gameCanvas');
    const gridCanvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const gtx = gridCanvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedInput = document.getElementById('speed');
    const glowInput = document.getElementById('glow');

    // logical grid
    const COLS=36, ROWS=27; // good ratio for 720x540 (20px cells)
    let cellSize = Math.floor(Math.min(canvas.width/COLS, canvas.height/ROWS));

    const Game = {
      running:false,
      lastT:0,
      accumulator:0,
      step:1/60,
      speed:9, // moves per second
      glow:16,
      score:0,
      multiplier:1,
      combo:0,
      snake:null,
      apple:null,
      particles:[],
      obstacles:[],
      gameOver:false,
    }

    function resetGame(){
      Game.speed = parseFloat(speedInput.value);
      Game.glow = parseFloat(glowInput.value);
      Game.score = 0; Game.multiplier=1; Game.combo=0; Game.gameOver = false;
      // snake uses floating positions for smoothness
      const startX = Math.floor(COLS/2);
      const startY = Math.floor(ROWS/2);
      Game.snake = createSnake(startX, startY, 6);
      placeObstacles();
      placeApple();
      Game.particles = [];
      updateScore();
    }

    function createSnake(x,y,len){
      const dir = {x:1,y:0};
      const segments = [];
      for(let i=0;i<len;i++) segments.push({x:x-i,y:y});
      return {segments,dir,desiredDir:{x:1,y:0},speed:Game.speed,moveTimer:0};
    }

    function placeObstacles(){
      Game.obstacles = [];
      const numObstacles = 8; // adjust as needed
      const occupied = new Set(Game.snake.segments.map(s=>s.x+','+s.y));
      for(let i=0; i<numObstacles; i++){
        let tries=0;
        while(true){
          const ox = Math.floor(Math.random()*COLS);
          const oy = Math.floor(Math.random()*ROWS);
          const key = ox+','+oy;
          if(!occupied.has(key)){
            Game.obstacles.push({x:ox,y:oy});
            occupied.add(key);
            break;
          }
          if(++tries>500) break;
        }
      }
    }

    function placeApple(){
      // choose random free cell
      const occupied = new Set(Game.snake.segments.map(s=>s.x+','+s.y));
      Game.obstacles.forEach(o=>occupied.add(o.x+','+o.y));
      let tries=0;
      while(true){
        const ax = Math.floor(Math.random()*COLS);
        const ay = Math.floor(Math.random()*ROWS);
        if(!occupied.has(ax+','+ay)) { Game.apple={x:ax,y:ay,ts:performance.now()}; break; }
        if(++tries>500) break;
      }
    }

    // Input
    const keys = {};
    window.addEventListener('keydown',e=>{
      const k = e.key;
      if(k==='ArrowUp' || k==='w' || k==='W') setDir(0,-1);
      if(k==='ArrowDown' || k==='s' || k==='S') setDir(0,1);
      if(k==='ArrowLeft' || k==='a' || k==='A') setDir(-1,0);
      if(k==='ArrowRight' || k==='d' || k==='D') setDir(1,0);
      if(k==='p' || k==='P') togglePause();
    });

    // Mobile tap steering: tap left/right/up/down of canvas
    canvas.addEventListener('pointerdown', e=>{
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left; const cy = e.clientY - r.top;
      const head = Game.snake.segments[0];
      const headPx = (head.x + 0.5)*cellSize;
      const headPy = (head.y + 0.5)*cellSize;
      const dx = cx - headPx, dy = cy - headPy;
      if(Math.abs(dx)>Math.abs(dy)) setDir(Math.sign(dx),0); else setDir(0,Math.sign(dy));
    });

    // Arrow button handlers
    document.getElementById('upBtn').addEventListener('click', () => setDir(0, -1));
    document.getElementById('downBtn').addEventListener('click', () => setDir(0, 1));
    document.getElementById('leftBtn').addEventListener('click', () => setDir(-1, 0));
    document.getElementById('rightBtn').addEventListener('click', () => setDir(1, 0));

    function setDir(x,y){
      const s = Game.snake;
      // prevent reverse
      if(s.dir.x + x === 0 && s.dir.y + y === 0) return;
      s.desiredDir = {x:x,y:y};
    }

    // Game update: discrete steps for grid logic, smooth rendering via interpolation
    function update(dt){
      // update desired speed based on slider
      Game.speed = parseFloat(speedInput.value);
      Game.glow = parseFloat(glowInput.value);

      const snake = Game.snake;
      snake.moveTimer += dt * Game.speed; // normalized: when moveTimer >=1, move one cell
      while(snake.moveTimer >= 1){
        snake.moveTimer -= 1;
        // lock in direction change
        snake.dir = snake.desiredDir;
        // compute new head cell
        const head = snake.segments[0];
        let nx = head.x + snake.dir.x;
        let ny = head.y + snake.dir.y;
        // wrap-around
        if(nx < 0) nx = COLS-1;
        if(nx >= COLS) nx = 0;
        if(ny < 0) ny = ROWS-1;
        if(ny >= ROWS) ny = 0;
        // collision with self
        if(snake.segments.some((s,i)=>i>0 && s.x===nx && s.y===ny)){
          // crash: reset with small animation
          explodeHead(nx,ny);
          Game.gameOver = true;
          return;
        }
        // collision with obstacles
        if(Game.obstacles.some(o=>o.x===nx && o.y===ny)){
          // crash: reset with small animation and error message
          explodeHead(nx,ny);
          Game.gameOver = true;
          return;
        }
        // move segments (unshift new head, pop tail)
        snake.segments.unshift({x:nx,y:ny});
        // apple check
        if(Game.apple && nx===Game.apple.x && ny===Game.apple.y){
          // grow: don't pop
          Game.combo++;
          Game.multiplier = Math.min(1 + Math.floor(Game.combo/3), 6);
          Game.score += Math.floor(10 * Game.multiplier);
          spawnParticles(nx,ny,8);
          placeApple();
        } else {
          // normal move
          snake.segments.pop();
          // reset combo slowly
          Game.combo = Math.max(0, Game.combo - 0.15);
          Game.multiplier = Math.max(1, Math.floor(1 + Game.combo/3));
        }
        updateScore();
      }
    }

    function updateScore(){
      scoreEl.textContent = `Score: ${Math.floor(Game.score)}`;
    }

    // Rendering
    function drawGrid(){
      const w = gridCanvas.width, h = gridCanvas.height;
      gtx.clearRect(0,0,w,h);
      gtx.save();
      gtx.globalAlpha = 0.08;
      gtx.translate(0.5,0.5);
      gtx.strokeStyle = '#2f3a60';
      gtx.lineWidth = 1;
      const gap = cellSize;
      for(let x=0;x<=w;x+=gap){ gtx.beginPath(); gtx.moveTo(x,0); gtx.lineTo(x,h); gtx.stroke(); }
      for(let y=0;y<=h;y+=gap){ gtx.beginPath(); gtx.moveTo(0,y); gtx.lineTo(w,y); gtx.stroke(); }
      gtx.restore();

      // subtle diagonal neon lines
      gtx.save(); gtx.globalAlpha = 0.06; gtx.strokeStyle = '#6f5cff'; gtx.lineWidth = 1;
      for(let i=-h;i<w;i+=64){ gtx.beginPath(); gtx.moveTo(i,0); gtx.lineTo(i+h,h); gtx.stroke(); }
      gtx.restore();
    }

    function draw(dt){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // background gradient
      const g = ctx.createLinearGradient(0,0,0,canvas.height);
      g.addColorStop(0,'rgba(8,10,22,0.8)'); g.addColorStop(1,'rgba(2,4,10,0.9)');
      ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

      // draw glowing snake
      const snake = Game.snake;
      // calculate interpolation factor
      const t = snake.moveTimer; // between 0 and 1

      // draw trail glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for(let i=snake.segments.length-1;i>=0;i--){
        const s = snake.segments[i];
        // next segment for interpolation
        let nx = s.x, ny = s.y;
        if(i===0){ // head interpolates towards next cell in dir
          nx = s.x - snake.dir.x * (1 - t);
          ny = s.y - snake.dir.y * (1 - t);
        } else {
          const prev = snake.segments[i-1];
          nx = s.x + (prev.x - s.x) * t;
          ny = s.y + (prev.y - s.y) * t;
        }
        const px = (nx + 0.5)*cellSize, py = (ny + 0.5)*cellSize;
        const size = cellSize * (0.8 - (i/snake.segments.length)*0.45);
        ctx.beginPath();
        ctx.shadowBlur = Game.glow * (1 - i/snake.segments.length);
        ctx.shadowColor = `rgba(0,255,213,${0.9 - i/snake.segments.length*0.7})`;
        ctx.fillStyle = `rgba(8,255,200,${0.18 + (1 - i/snake.segments.length)*0.5})`;
        roundRect(ctx, px-size/2, py-size/2, size, size, 6);
        ctx.fill();
      }
      ctx.restore();

      // draw outline head
      const head = snake.segments[0];
      const hx = (head.x + 0.5 - snake.dir.x*(1 - snake.moveTimer))*cellSize;
      const hy = (head.y + 0.5 - snake.dir.y*(1 - snake.moveTimer))*cellSize;
      ctx.save();
      ctx.lineWidth = 2; ctx.strokeStyle = '#7c5cff'; ctx.globalAlpha = 0.95;
      ctx.beginPath(); roundRect(ctx,hx-cellSize*0.35,hy-cellSize*0.35,cellSize*0.7,cellSize*0.7,6); ctx.stroke();
      ctx.restore();

      // draw obstacles
      Game.obstacles.forEach(o=>{
        const ox = (o.x + 0.5) * cellSize;
        const oy = (o.y + 0.5) * cellSize;
        ctx.save();
        ctx.shadowBlur = Game.glow*0.5; ctx.shadowColor='rgba(100,100,100,0.3)';
        ctx.fillStyle='rgba(50,50,50,0.8)';
        ctx.beginPath(); roundRect(ctx, ox-cellSize*0.4, oy-cellSize*0.4, cellSize*0.8, cellSize*0.8, 4); ctx.fill();
        ctx.restore();
      });

      // draw apple
      if(Game.apple){
        const ax = (Game.apple.x + 0.5) * cellSize;
        const ay = (Game.apple.y + 0.5) * cellSize;
        ctx.save();
        ctx.shadowBlur = Game.glow*1.2; ctx.shadowColor='rgba(255,80,120,0.45)';
        ctx.fillStyle='rgba(255,120,150,0.98)';
        ctx.beginPath(); ctx.ellipse(ax,ay,cellSize*0.33,cellSize*0.33,0,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // particles
      updateAndDrawParticles(dt);

      // small HUD overlay on canvas (combo)
      if(Game.multiplier>1){
        ctx.save(); ctx.font='16px system-ui'; ctx.globalAlpha=0.9; ctx.fillStyle='#ffd87a';
        ctx.fillText('x'+Game.multiplier, 12, 28);
        ctx.restore();
      }

      // Game Over message on canvas
      if(Game.gameOver){
        ctx.save();
        ctx.font = 'bold 48px system-ui';
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '24px system-ui';
        ctx.fillStyle = '#dfe9ff';
        ctx.fillText('Press Reset to Play Again', canvas.width / 2, canvas.height / 2 + 20);
        ctx.restore();
      }
    }

    function roundRect(ctx,x,y,w,h,r){
      ctx.moveTo(x+r,y);
      ctx.arcTo(x+w,y,x+w,y+h,r);
      ctx.arcTo(x+w,y+h,x,y+h,r);
      ctx.arcTo(x,y+h,x,y,r);
      ctx.arcTo(x,y,x+w,y,r);
      ctx.closePath();
    }

    function spawnParticles(cx,cy,n){
      for(let i=0;i<n;i++){
        Game.particles.push({
          x: (cx+0.5)*cellSize,
          y: (cy+0.5)*cellSize,
          vx: (Math.random()-0.5)*140,
          vy: (Math.random()-0.5)*140,
          life: 0.7 + Math.random()*0.5
        });
      }
    }

    function explodeHead(x,y){
      spawnParticles(x,y,24);
      Game.score = Math.max(0, Game.score - 20);
    }

    function updateAndDrawParticles(dt){
      const arr = Game.particles;
      for(let i=arr.length-1;i>=0;i--){
        const p = arr[i];
        p.life -= dt;
        if(p.life<=0){ arr.splice(i,1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 200*dt; // gravity
        const alpha = Math.max(0, p.life);
        ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.fillStyle='rgba(255,180,140,0.9)'; ctx.arc(p.x,p.y,Math.max(1,3*alpha),0,Math.PI*2); ctx.fill(); ctx.restore();
      }
    }

    // main loop
    function loop(t){
      const dt = Math.min(0.033, (t - Game.lastT)/1000);
      Game.lastT = t;
      if(Game.running && !Game.gameOver){
        update(dt);
      }
      draw(dt);
      requestAnimationFrame(loop);
    }

    // resize handling
    function fit(){
      const wrapper = document.getElementById('stage');
      const rect = wrapper.getBoundingClientRect();
      canvas.width = Math.floor(rect.width); canvas.height = Math.floor(rect.height);
      gridCanvas.width = canvas.width; gridCanvas.height = canvas.height;
      cellSize = Math.floor(Math.min(canvas.width/COLS, canvas.height/ROWS));
      drawGrid();
    }
    window.addEventListener('resize', ()=>{ fit(); });

    // controls
    playBtn.addEventListener('click', ()=>{ Game.running=true; Game.lastT = performance.now(); });
    pauseBtn.addEventListener('click', ()=>{ Game.running=false; });
    resetBtn.addEventListener('click', ()=>{ resetGame(); });

    function togglePause(){ Game.running = !Game.running; }

    // initialize
    fit(); resetGame(); drawGrid();
    // start paused
    Game.running = false; Game.lastT = performance.now(); requestAnimationFrame(loop);

  })();
