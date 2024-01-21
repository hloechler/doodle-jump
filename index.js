
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let score = 0
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let upTimerId
    let downTimerId

//Creating the platform placement randomly
    class Platform {
        constructor (newPlatBottom){
            this.left = Math.random() * 315
            this.bottom = newPlatBottom
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)

        }
    }

//Creating a new platform everytime one dissapears
    function createPlatforms(){
        for(let i = 0; i < platformCount; i++){
            let platGap = 600 / platformCount  
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
        }
    }

//Moving the platforms from the top to the bottom and keeps track of the score
    function movePlatforms() {
        if (doodlerBottomSpace >= 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    
//Adds and positions the doodler
    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

//Causes the doodler to fall
    function fall(){
        isJumping = false
        clearTimeout(upTimerId)
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left + 85) && 
                    !isJumping
                ){
                    startPoint = doodlerBottomSpace
                    jump()
                    console.log('startPoint', startPoint)
                    isJumping = true
                }
            })
        }, 20)
    }
    
//Moves the doodler up the page to jump on the platforms
    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() =>{
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200){
                fall()
                isJumping = false
            }
        }, 30)
    }

//What happens if the left key is pressed
    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(()=>{
            if (doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

//What happens if the right key is pressed
    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 313){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

//Keeps the doodler in the same spot to jump straight up
    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

//Moves the doodler based on what key is pressed
    function control (e){
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if (e.key === 'ArrowLeft'){
            moveLeft()
        } else if (e.key === 'ArrowRight'){
            moveRight()
        } else if (e.key === 'ArrowUp'){
            moveStraight()
        }
    }

//Game over function to end the game
    function gameOver(){
        isGameOver = true
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
    }

//Start function to start the game
    function start() {
        if(!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})