import * as PIXI from 'pixi.js'
import SpriteObject from './Objectstuff/SpriteObject'
import Vector2 from './ExtraStuff/Vector2'
import BigPentagon from './assets/testPentagon.png'
import smallPentagon from './assets/testPentagonSmall.png'
import PixelConverter from '~PixelClasses/Pixel'
import PhysicsWorld from '~Collision/PhysicsWorld'
import HugePentagon from './assets/testPentagonHuge.png'
import Rectangle, { Line } from '~geometry/rectangle'
import { Color } from '~ExtraStuff/colors'
import Polygon from '~geometry/poligon'
import PixelCollision from '~Collision/PixelCollision'
import { Raster } from '~ExtraStuff/dataStructures'



export default class App{
    private  pixi = new PIXI.Application({width:4096,height:4096,});
    private renderer = this.pixi.renderer
    private movingObject:SpriteObject;
    private stillObject:SpriteObject
    //private sprite:PIXI.Sprite
    private loader:PIXI.Loader
    private debugColl:PIXI.Graphics
    private world:PhysicsWorld
    private testRect:Rectangle
    private OverlapPolygon:Polygon
    private second:Polygon
    private LoseTest:Polygon
    private debugGraphics:PIXI.Graphics
    private tester:number
    private rect:number[][]
    private raster:Raster[][]
    constructor(){
        this.renderer.backgroundColor = 0x07f0d9;
        document.body.appendChild(this.pixi.view);
        this.world = new PhysicsWorld();
        this.debugGraphics = new PIXI.Graphics
        this.pixi.stage.addChild(this.debugGraphics)
        
        
        
        //this.sprite = new PIXI.Sprite(text2);
        
        //  let sprite2 = new PIXI.Sprite(text2)
        //sprite2.scale = new PIXI.Point(1,1);
        //sprite2.position = new PIXI.Point(510,510)
        //this.movingObject = new SpriteObject(sprite,this.renderer)

      
        
        //console.log(this.sprite)
        
        //this.test()
       
        
        this.create()
        //this.linetest()
        //this.rect = [new Vector2(0,0),new Vector2(500,500)]
         
        //this.DrawRects(this.rect)
       
       document.addEventListener('keydown',(event:KeyboardEvent)=>{
           if(event.keyCode === 32){
            //console.log(this.renderer.extract.pixels(this.sprite));
            this.movingObject.Rotate = this.movingObject.rotation + 15;
            
            //console.time("polygonOverlap")
            //this.LoseTest.UpdateVerticies = Polygon.GetPoligonOverlap(this.movingObject.boxColl,this.stillObject.boxColl ,this.OverlapPolygon).Vertices
            //console.timeEnd("polygonOverlap")



            //this.rect = this.HalveRectTest(this.rect)
            //this.DrawRects(this.rect)
                
           }

           if(event.keyCode ==67){
            // let Vec2 = new Vector2(this.OverlapPolygon.Vertices[0].x + 125,this.OverlapPolygon.Vertices[0].y + 125)
            // this.debugGraphics.beginFill(Color.red)
            // this.debugGraphics.drawCircle(Vec2.x,Vec2.y,5);

            // if(Polygon.PointInPolygon(new Vector2(Vec2.x -100,Vec2.y -100),this.OverlapPolygon.Vertices)){
                // console.log("point in polygon")
            // }
            if(this.OverlapPolygon.Vertices.length>2 && false){
                this.debugGraphics.beginFill(Color.red)
                let stop= false
                let OverlapPolygon = this.OverlapPolygon
                let obj1 = this.movingObject
                let obj2 = this.stillObject
                let vertspoly1 = obj1.getPolygonTransformed(OverlapPolygon)
                let localBox1 = obj1.getPolygonBoundingBox(vertspoly1);
        
                let vertsPoly2 = obj2.getPolygonTransformed(OverlapPolygon);
                let localBox2 = obj2.getPolygonBoundingBox(vertsPoly2)
                let devideAmount = 6
                let List:number[][] =[[localBox1[0].x,localBox1[0].y],[localBox1[1].x,localBox1[0].y],[localBox1[0].x,localBox1[1].y],[localBox1[1].x,localBox1[1].y]]
                for(let l = 0;l<List.length;l++){
                    this.debugGraphics.drawCircle(List[l][0]+1000 ,List[l][1]+100,5);
                    if(PixelCollision.CheckPixel(List[l][0] ,List[l][1],obj1,obj2,vertspoly1,localBox2)){
                        
                        break;
                        return {val:true,pixel:new Vector2(List[l][0] ,List[l][1])}
                    }
                }
                
                let width = localBox1[1].x - localBox1[0].x
                let height = localBox1[1].y - localBox1[0].y
                let currentWidth  = width
                let currentHeight = height
                for(let d = 0;d<devideAmount;d++){
                    console.log(List)
                    currentHeight = Math.floor(currentHeight *0.5)
                    currentWidth =Math.floor(currentWidth *0.5)
                    let toAdd:number[][] = []
                    for(let l = 0;l<List.length;l++){
                        console.log(List[l])
                        if(List[l][0] < width){
                            console.log(List[l][0] + currentWidth ,List[l][1])
                            
                            if(PixelCollision.CheckPixel(List[l][0] + currentWidth,List[l][1],obj1,obj2,vertspoly1,localBox2)){
                                this.debugGraphics.drawCircle(List[l][0] + currentWidth+1000 ,List[l][1]+100,5);
                                //break;
                                //return {val:true,pixel:new Vector2(List[l][0] + currentWidth,List[l][1])}
                            }
                            toAdd.push([List[l][0] + currentWidth,List[l][1]])
                        }
                        if(List[l][1] < height){
                            console.log(List[l][0] ,List[l][1]+ currentHeight)
                            
                            if(PixelCollision.CheckPixel(List[l][0] ,List[l][1]+ currentHeight,obj1,obj2,vertspoly1,localBox2)){
                                this.debugGraphics.drawCircle(List[l][0]+1000 ,List[l][1] + currentHeight+100,5);
                                //break;
                                //return {val:true,pixel:new Vector2(List[l][0] ,List[l][1] + currentHeight)}
                            }
                            toAdd.push([List[l][0] ,List[l][1] + currentHeight])
                        }
                        
                        if(List[l][0] < width&&List[l][1] < height){
                            console.log(List[l][0] + currentWidth,List[l][1]+currentHeight)
                            
                            if(PixelCollision.CheckPixel(List[l][0] + currentWidth,List[l][1]+currentHeight,obj1,obj2,vertspoly1,localBox2)){
                                this.debugGraphics.drawCircle(List[l][0] + currentWidth +1000 ,List[l][1] + currentHeight+100,5);
                                //break;
                                //return {val:true,pixel:new Vector2(List[l][0] + currentWidth,List[l][1]+currentHeight)}
                            }
                            toAdd.push([List[l][0] + currentWidth,List[l][1]+currentHeight])
                        }
                    }
                    List.push(...toAdd)
                
                
            }
                this.debugGraphics.endFill()
            }

            if(this.OverlapPolygon.Vertices.length>2 && false){
                console.time("overlap collision test")
                let nPixelCollobj = PixelCollision.OverlapPolygonCollision(this.movingObject,this.stillObject,this.OverlapPolygon)
                console.timeEnd("overlap collision test")
                if(nPixelCollobj.val){
                    this.debugGraphics.beginFill(Color.red)
                    this.debugGraphics.drawCircle(nPixelCollobj.pixel.x + 1000  ,nPixelCollobj.pixel.y+ 100,5);
                    let rotation = this.movingObject.rotation
                    let rad = (rotation / 180) * Math.PI;
                    let x = nPixelCollobj.pixel.x*Math.cos(rad) - nPixelCollobj.pixel.y*Math.sin(rad)
                    let y = nPixelCollobj.pixel.y*Math.cos(rad) + nPixelCollobj.pixel.x*Math.sin(rad)
    
                    x = x + this.movingObject.position.x - this.stillObject.position.y
                    y = y + this.movingObject.position.y - this.stillObject.position.y
    
                    this.debugGraphics.beginFill(Color.red)
                    this.debugGraphics.drawCircle(x + 1000,y+ 700,5);
                    this.debugGraphics.drawCircle(x+100,y+100,5 )
    
                }
           }



           if(this.OverlapPolygon.Vertices.length>2){

            let cpos1 = this.movingObject.centrePos()
        let cpos2 = this.stillObject.centrePos()

        let dirX = cpos2.x - cpos1.x
        let dirY = cpos2.y - cpos1.y
        let rad = (-this.movingObject.rotation / 180) * Math.PI;
        let rotx = dirX*Math.cos(rad) - dirY*Math.sin(rad)
        let roty = dirY*Math.cos(rad) + dirX*Math.sin(rad)
        let loopDirection:LoopDir
        let flip = false
        this.debugGraphics.lineStyle(3,Color.white)
        this.debugGraphics.moveTo(1250,350)
        this.debugGraphics.lineTo(1250 + rotx,350+roty)
        
        if(rotx<0&&roty<0){
            loopDirection = LoopDir.Pos
        }
        else if(rotx<0&&roty>0){
            loopDirection = LoopDir.YNeg
        }
        else if(rotx>0&&roty<0){
            loopDirection = LoopDir.XNeg
        }
        else{
            loopDirection = LoopDir.Neg
        }

        if(Math.abs(rotx)>Math.abs(roty)){
            flip = true
        }

            //console.log(rotx,roty,loopDirection)

            console.time("overlap collision test")
            let nPixelCollobj = PixelCollision.OverlapRasterCollixion(this.movingObject,this.stillObject,this.OverlapPolygon)
            console.timeEnd("overlap collision test")


            if(nPixelCollobj.val){
                this.debugGraphics.beginFill(Color.red)
                this.debugGraphics.drawCircle(nPixelCollobj.pixel.x + 1000  ,nPixelCollobj.pixel.y+ 100,5);
                let rotation = this.movingObject.rotation
                let rad = (rotation / 180) * Math.PI;
                let x = nPixelCollobj.pixel.x*Math.cos(rad) - nPixelCollobj.pixel.y*Math.sin(rad)
                let y = nPixelCollobj.pixel.y*Math.cos(rad) + nPixelCollobj.pixel.x*Math.sin(rad)

                x = x + this.movingObject.position.x - this.stillObject.position.y
                y = y + this.movingObject.position.y - this.stillObject.position.y

                this.debugGraphics.beginFill(Color.red)
                this.debugGraphics.drawCircle(x + 1000,y+ 700,5);
                this.debugGraphics.drawCircle(x+100,y+100,5 )


            }
       
           }
        }
       })
    }

    private DrawRects(rect:Vector2[]){
        this.debugGraphics.clear()
        this.debugGraphics.lineStyle(2,Color.red)
        for(let y = 0;y<rect.length-1;y++){
            for(let x = 0;x<rect.length -1;x++){
                this.drawLines([new Vector2(rect[x].x,rect[y].y),new Vector2(rect[x + 1].x,rect[y].y),new Vector2(rect[x +1].x,rect[y+ 1].y),new Vector2(rect[x].x,rect[y+1].y)])
            }
        }
    }
    private HalveRectTest(rect:Vector2[]){
        let RectNew:Vector2[] = []
        for(let i = 0;i<rect.length -1;i++){
            let x = rect[i].x + ((rect[i+1].x - rect[i].x)/2)
            let y = rect[i].y + ((rect[i+1].y - rect[i].y)/2)

            RectNew.push(rect[i])
            RectNew.push(new Vector2(x,y))
        }
        RectNew.push(rect[rect.length -1])

        return RectNew
    }

    private FollowMouse(event:MouseEvent, spriteObj:SpriteObject){
       spriteObj.position = new Vector2(event.clientX,event.clientY)
       //console.time('totalCheck')
       //this.world.checkColl()
       
       this.LoseTest.UpdateVerticies = Polygon.GetPoligonOverlap(this.movingObject.boxColl,this.stillObject.boxColl,this.OverlapPolygon).Vertices
       if(this.OverlapPolygon.Vertices.length>2){
        console.time("overlap collision test")
        let nPixelCollobj = PixelCollision.OverlapPolygonCollision(this.movingObject,this.stillObject,this.OverlapPolygon)
        console.timeEnd("overlap collision test")
       }
        this.drawDebug()
       //console.timeEnd('totalCheck')
       
    }

    private drawDebug(){
        let vertspoly = this.movingObject.getPolygonTransformed(this.OverlapPolygon)
        let box = this.movingObject.getPolygonBoundingBox(vertspoly);
        let localBox = [box[0],new Vector2(box[1].x,box[0].y),box[1],new Vector2(box[0].x,box[1].y)]
        let global = this.movingObject.transformToGlobal(localBox);

        let vertspoly2 = this.stillObject.getPolygonTransformed(this.OverlapPolygon)
        let box2 = this.stillObject.getPolygonBoundingBox(vertspoly2);
        let localBox2 = [box2[0],new Vector2(box2[1].x,box2[0].y),box2[1],new Vector2(box2[0].x,box2[1].y)]
        let global2 = this.stillObject.transformToGlobal(localBox2)
        //console.log(global)
        //console.log(this.OverlapPolygon.reletiveVerts)
        this.debugGraphics.clear()
        this.debugGraphics.lineStyle(2,Color.blue )
        this.drawLines(localBox,new Vector2(1000,100))
        
        this.drawLines(localBox2,new Vector2(1000,700))
        this.debugGraphics.lineStyle(2,Color.blue  )

        this.drawLines(global)
        this.drawLines(global2)
        let w1 = Math.floor(box[1].x - box[0].x)
        let h1 = Math.floor(box[1].y - box[0].y)
        let w2 = Math.floor(box[1].x - box[0].x)
        let h2 = Math.floor(box[1].y - box[0].y)
        let area1 = w1*h1
        let area2 = w2 *h2
        if(area1 !== area2){
        console.log(`width 1: ${w1}, height 1: ${h1}, area 1: ${area1}`)
        console.log(`width 2: ${w2}, height 2: ${h2}, area 2: ${area2}`)
        }
        this.debugGraphics.lineStyle()
        this.debugGraphics.beginFill(Color.green,0.5)
        let pix:PIXI.Point[] = []
        for(let j = 0;j<vertspoly.length;j++){
            pix.push(new PIXI.Point(vertspoly[j].x + 1000,vertspoly[j].y +100))
        }
        this.debugGraphics.drawPolygon(pix)
        this.debugGraphics.beginFill(Color.yellow,0.5)
        let pix2:PIXI.Point[] = []
        for(let j = 0;j<vertspoly2.length;j++){
            pix2.push(new PIXI.Point(vertspoly2[j].x + 1000,vertspoly2[j].y +700))
        }
        this.debugGraphics.drawPolygon(pix2)
        this.debugGraphics.endFill()

        
        
        for(let yR = 0;yR<this.raster.length;yR++){ 
            for(let xR = 0;xR<this.raster[yR].length;xR++){
            
            if(this.raster[yR][xR].check){
                    this.debugGraphics.beginFill(Color.gray,0.5)
                }
                else{
                    this.debugGraphics.beginFill(Color.red,0.5)
                }
                let x = xR * this.raster[yR][xR].Width + 1000
                let y = yR * this.raster[yR][xR].Height + 100
                this.debugGraphics.drawRect(x,y,this.raster[yR][xR].Width -3,this.raster[yR][xR].Height -3)
                
            }
        }
        this.debugGraphics.endFill()

        let checkRasters = PixelCollision.RasterInOverlap(box,vertspoly,this.raster)
        //console.log(this.raster,vertspoly)
        this.debugGraphics.beginFill(Color.purple,0.7)
        for(let i = 0; i<checkRasters.length;i++){
            let x = checkRasters[i].x + 1000
            let y = checkRasters[i].y + 100   
            this.debugGraphics.drawRect(x,y,checkRasters[i].Width -3,checkRasters[i].Height -3)
        }


        

        //let PointToDrawLocal = new Vector2(100,400)

        // this.debugGraphics.beginFill(Color.red)
        // this.debugGraphics.drawCircle(PointToDrawLocal.x + 1000,PointToDrawLocal.y+ 100,5);
        
        // let globalPoint = this.movingObject.transformToGlobal([PointToDrawLocal]);
        // this.debugGraphics.beginFill(Color.red)
        // this.debugGraphics.drawCircle(globalPoint[0].x ,globalPoint[0].y,5);

        // let rotation = this.movingObject.rotation
        // let rad = (rotation / 180) * Math.PI;
        // let x = PointToDrawLocal.x*Math.cos(rad) - PointToDrawLocal.y*Math.sin(rad)
        // let y = PointToDrawLocal.y*Math.cos(rad) + PointToDrawLocal.x*Math.sin(rad)

        // x = x + this.movingObject.position.x - this.stillObject.position.y
        // y = y + this.movingObject.position.y - this.stillObject.position.y

        // this.debugGraphics.beginFill(Color.red)
        // this.debugGraphics.drawCircle(x + 1000,y+ 700,5);
        this.debugGraphics.endFill()

    }

    public drawLines(Array:Vector2[],offset:Vector2 = new Vector2(0,0)){
        this.debugGraphics.moveTo(Array[0].x + offset.x,Array[0].y + offset.y)
        for(let i = 1;i<Array.length;i++){
            this.debugGraphics.lineTo(Array[i].x+ offset.x,Array[i].y+ offset.y)
        }
        this.debugGraphics.lineTo(Array[0].x+ offset.x,Array[0].y+ offset.y)
    }
    
    private FollowMouseRect(event:MouseEvent, rect:Polygon){
        rect.setPosition = new Vector2(event.clientX,event.clientY)
        this.LoseTest.UpdateVerticies = Polygon.GetPoligonOverlap(this.testRect,this.second,this.OverlapPolygon).Vertices
        
     }

    private linetest(){
        let rect1verts:Vector2[] = [new Vector2(0,0),new Vector2(200,0),new Vector2(200,200),new Vector2(0,200)]
        let rect2verts:Vector2[] = [new Vector2(0,0),new Vector2(200,0),new Vector2(200,200),new Vector2(0,200 )]
        let cirVerts:Vector2[] = []
        var step = (2 * Math.PI) / 20;
    
        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
          var x = (300 / 2) * Math.cos(theta);
          var y = (300 / 2) * Math.sin(theta);
          var vertice = new Vector2(x, y);
          cirVerts.push(vertice)
        }
        this.testRect = new Rectangle(rect1verts,new Vector2(50,50),Color.green)
        this.second = new Polygon(rect2verts,new Vector2(200,200),Color.blue)
        
        this.OverlapPolygon = Polygon.GetPoligonOverlap(this.testRect,this.second);
        this.LoseTest = new Polygon(this.OverlapPolygon.Vertices,new Vector2(800,200),Color.white,1)
        this.debugGraphics = new PIXI.Graphics()
        this.debugGraphics.lineStyle(2,Color.blue)
        

        this.pixi.stage.addChild(this.testRect.DrawPolygon(),this.second.DrawPolygon(),this.OverlapPolygon.DrawPolygon(),this.LoseTest.DrawPolygon(),this.debugGraphics)

        document.addEventListener('mousemove',(event: MouseEvent)=>{ this.FollowMouseRect(event,this.testRect);})
    }

    
    private async create(){
        console.time("getPixelData")
        let arr = await this.getPixelViaCanvas(BigPentagon)
        //let arr2 = await this.getPixelViaCanvas(HugePentagon)
        console.timeEnd("getPixelData")
        let loader = PIXI.Loader.shared;
        let sprite:PIXI.Sprite
        let sprite2:PIXI.Sprite
        let sprite3:PIXI.Sprite
        let sprite4:PIXI.Sprite
        let sprtarr:PIXI.Sprite[] = []
        loader.add('image',BigPentagon).add('img2',HugePentagon);
        loader.load((load,resource) =>{
            sprite = new PIXI.Sprite(resource.image?.texture);
            sprite2 = new PIXI.Sprite(resource.image?.texture)
            sprite3 = new PIXI.Sprite(resource.image?.texture)
            sprite4 = new PIXI.Sprite(resource.image?.texture)
            for(let i =0;i<12;i++){
                //sprtarr.push(new PIXI.Sprite(resource.image?.texture))
            }
            let rect1verts:Vector2[] = [new Vector2(0,0),new Vector2(500,0),new Vector2(500,500),new Vector2(0,500)]
            this.OverlapPolygon = new Polygon(rect1verts,new Vector2(0,0),Color.purple    ,0.5)
            this.LoseTest = new Polygon(this.OverlapPolygon.Vertices,new Vector2(800,100),Color.white,1)
            this.debugGraphics = new PIXI.Graphics()

            sprite3.position = new PIXI.Point(1000,100)
            sprite4.position = new PIXI.Point(1000,700)

            this.pixi.stage.addChild(sprite,sprite2,sprite3,sprite4,/*this.LoseTest.DrawPolygon(),*/this.OverlapPolygon.DrawPolygon(),this.debugGraphics)
        })

        loader.onComplete.add(()=>{
            
            
            
            this.raster = this.Rastiraze(arr)
            
            this.movingObject = new SpriteObject(sprite,arr,this.raster,new Vector2(0,0),new Vector2(1,1),Color.yellow)            
            this.stillObject = new SpriteObject(sprite2,arr,this.raster,new Vector2(100,100),new Vector2(1,1),Color.green)
            //let VertexCheckList:Vector2[] = this.MakeList(this.movingObject.sprite.texture.width,this.movingObject.sprite.texture.height,4)
            
            
            //this.OverlapPolygon.DrawPolygon();
            document.addEventListener('mousemove',(event: MouseEvent)=>{ this.FollowMouse(event,this.movingObject);})
            this.world.addObjects([this.movingObject,this.stillObject])
        }) 
    }


    private MakeList(width:number,height:number,devideAmount:number){
        let List:Vector2[] = [new Vector2(0,0),new Vector2(width,0),new Vector2(0,height),new Vector2(width,height)]
        let currentWidth  = width
        let currentHeight = height
        for(let d = 0;d<devideAmount;d++){
            currentHeight *= 0.5
            currentWidth *= 0.5
            let toAdd:Vector2[] = []
            for(let l = 0;l<List.length;l++){
                if(List[l].x < width){
                    toAdd.push(new Vector2(List[l].x + currentWidth,List[l].y))
                }
                if(List[l].y < height){
                    toAdd.push(new Vector2(List[l].x ,List[l].y + currentHeight))
                }
                if(List[l].x < width&&List[l].y < height){
                    toAdd.push(new Vector2(List[l].x + currentWidth,List[l].y+currentHeight))
                }
            }
            List.push(...toAdd)

        }


        return List
    }

    private Rastiraze(pixelData:number[][]){
        let gridSize = 25
        let yRasAmount = pixelData.length /gridSize
        let xRasAmount = pixelData[0].length /gridSize
        
        let raster:Raster[][] = []
        for(let yR = 0; yR<yRasAmount;yR++){ // ras y amount
            raster[yR] = []
            
            for(let xR = 0;xR<xRasAmount;xR++){ //ras x amount
                
                let r:Raster = {
                    Height : gridSize,
                    Width : gridSize,
                    x:xR * gridSize,
                    y:yR * gridSize,
                    check : this.checkForAnyAlpha(pixelData,gridSize,gridSize,xR,yR)
                }
                
                raster[yR].push(r)
            }
        }
        return raster
    }

    private checkForAnyAlpha(pixelData:number[][],width:number,height:number,x:number,y:number){
        for(let Py = height *y;Py<height *(y +1);Py++){
            for(let Px = width *x;Px<width *(x +1);Px++){
                
                if(pixelData[Py][Px]>50){
                    
                    return true
                }
            }
        }
        return false
    }



    private async TestPixelLoading(imgtotest:string){
        console.group("PIXI")
        console.time('Pixi pixel loader')
        //let c = await this.getPixelViaPIXI(imgtotest)
        //console.log(c)
        console.timeEnd('Pixi pixel loader')
        console.groupEnd()
        console.group("get Canvas")
        console.time('Canvas pixel loader')
        let p = await this.getPixelViaCanvas(imgtotest);
        console.log(p)
        console.timeEnd('Canvas pixel loader')
        console.groupEnd()
    }

    private async getPixelViaPIXI(img: string):Promise<boolean[][]>{
        return new Promise((resolve,reject)=>{
        let loader = PIXI.Loader.shared;
        let sprt:PIXI.Sprite
        loader.add('smallPent',img);
        loader.load((load,resource) =>{
            sprt = new PIXI.Sprite(resource.smallPent?.texture);
            console.log(resource.smallPent)
            this.pixi.stage.addChild(sprt)
        })
        loader.onComplete.add(()=>{
            let pxls = this.renderer.extract.pixels(sprt)
            let arr = PixelConverter.ConvertFromNumberArray(Array.from(pxls),sprt.texture.width,sprt.texture.height)
            console.log(pxls)
            //console.log(arr)
            //resolve(arr)
            
        })
    })
    }

    private async getPixelViaCanvas(image:string):Promise<number[][]>{
        return new Promise((resolve,reject)=>{
            
            const imgSource = document.createElement("img")
            imgSource.src = image
            
            document.body.appendChild(imgSource)
            imgSource.onload = function(){
                
                console.log(imgSource)
                let canvas = null;
                if (!imgSource) {
                    reject("???")
                }
                let context = null;
                if (imgSource instanceof Image) {
                    canvas = document.createElement('canvas');
                    canvas.width = imgSource.width;
                    canvas.height = imgSource.height;
                    context = canvas.getContext('2d');
                    context!.drawImage(imgSource, 0, 0);
                } else {
                    //unknown source;
                    reject('unknown source')
                }
            
                const w = canvas!.width, h = canvas!.height;
                let imageData = context!.getImageData(0, 0, w, h);
                console.log(imageData)
                let pxls = PixelConverter.ConvertFromNumberArray(Array.from(imageData.data),w,h)

                //console.log(pxls)

                console.groupEnd()
                document.body.removeChild(imgSource)
                resolve(pxls)
            }

    })
    }

    async test(){
        const a = await this.promiseTest(true)
        try{const b = await this.promiseTest(false)}
        catch(error){
            console.log(error)
        }
        console.log(a)
        
    }

    async promiseTest(res:boolean):Promise<string>{
        return new Promise((resolve,reject)=>{
            if(res){
                resolve("Resolved")
            }
            else{
                reject({msg:"rejected"})
            }
        })
    }
        

    
}

enum LoopDir{
    Pos,
    Neg,
    YNeg,
    XNeg,
}

