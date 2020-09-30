import * as PIXI from 'pixi.js'
import Vector2 from '../ExtraStuff/Vector2'
import PixelConverter from '~PixelClasses/Pixel'
import { Color } from '~ExtraStuff/colors'
import Rectangle from '~geometry/rectangle'
import Polygon from '~geometry/poligon'
import { Raster } from '~ExtraStuff/dataStructures'

export default class SpriteObject{
    private _position:Vector2
    public sprite:PIXI.Sprite
    public scale:Vector2
    public rotation:number
    public Pixelcoll:number[][]
    public boxColl:Rectangle
    public debugColl:PIXI.Graphics
    public maxColl:number = 0
    public anchor:Vector2
    public RasterData:Raster[][]
    constructor(sprite:PIXI.Sprite,PixelArr:number[][],rasterData:Raster[][], pos:Vector2 = new Vector2(0,0),size:Vector2 = new Vector2(1,1),color = Color.black){
        this._position = pos;
        this.scale = size;
        this.rotation = 0;
        this.sprite = sprite
        this.Pixelcoll = PixelArr
        this.RasterData = rasterData
        this.sprite.anchor = new PIXI.Point(0,0)
        this.anchor = new Vector2(0,0)
        this.sprite.position = new PIXI.Point(pos.x,pos.y);
        this.sprite.scale = new PIXI.Point(size.x,size.y);
        
    
        let collvetrs = [new Vector2(0,0),new Vector2(sprite.width -1,0),new Vector2(sprite.width-1,sprite.height-1),new Vector2(0,sprite.height-1)]
        this.boxColl = new Rectangle(collvetrs,pos,color,0.5)
        this.boxColl.setSpriteObject(this)
        this.debugColl = new PIXI.Graphics()
        
        //this.drawDebug(Color.red,0)
        this.sprite.addChild(this.debugColl,this.boxColl.DrawPolygon())
        
        
        
    }

    public get position():Vector2{
        return this._position
    }
    public set position(value:Vector2){
        this._position = value
        this.sprite.position = new PIXI.Point(value.x,value.y)
        this.boxColl.setPosition = value
        //this.debugColl.position = new PIXI.Point(value.x,value.y)
        //console.log(this._position) 
    }

    public centrePos(){
        let x = this.sprite.width/2
        let y =   this.sprite.height/2
        let rotation = this.rotation
        let rad = (rotation / 180) * Math.PI;

        let xnew = x*Math.cos(rad) - y*Math.sin(rad)
        let ynew = y*Math.cos(rad) + x*Math.sin(rad)

        return new Vector2(xnew +this.position.x, ynew + this.position.y)

    }

    public set Rotate(value:number){
        this.rotation = value
        this.sprite.rotation = (value / 180) * Math.PI;
        this.boxColl.Rotation = value

        
    }

    public getPolygonTransformed(polygon:Polygon){
        let polyLocalVertexArray:Vector2[] =[]
        let rot = - this.rotation
        let rad = (rot / 180) * Math.PI;
        let reletiveVerts = polygon.reletiveVerts
         for(let i = 0;i<polygon.Vertices.length;i++){

            let xn = reletiveVerts[i].x - this.position.x
            let yn = reletiveVerts[i].y - this.position.y


            let x = xn*Math.cos(rad) - yn*Math.sin(rad)
            let y = yn*Math.cos(rad) + xn*Math.sin(rad)


            x = Math.round(x)>this.sprite.texture.width -1?this.sprite.texture.width -1:Math.round(x)
            y = Math.round(y)>this.sprite.texture.height -1?this.sprite.texture.height -1:Math.round(y)
            polyLocalVertexArray.push(new Vector2(x,y))
         }
         return polyLocalVertexArray
    }
    
    public transformToGlobal(vec2:Vector2[]){
        let polyLocalVertexArray:Vector2[] =[]
        let rotation = this.rotation
        let rad = (rotation / 180) * Math.PI;
        
         for(let i = 0;i<vec2.length;i++){
            let x = vec2[i].x*Math.cos(rad) - vec2[i].y*Math.sin(rad)
            let y = vec2[i].y*Math.cos(rad) + vec2[i].x*Math.sin(rad)

            x = x + this.position.x
            y = y + this.position.y
            polyLocalVertexArray.push(new Vector2(x,y))
         }
         return polyLocalVertexArray
    }

    public getPolygonBoundingBox(polgonVerts:Vector2[]){
        
        let max = new Vector2(0,0);
        let min = new Vector2(10000,10000);
        for(let i = 0;i<polgonVerts.length;i++){

            if(polgonVerts[i].x>max.x){
                max.x = polgonVerts[i].x <= this.sprite.width ? polgonVerts[i].x: this.sprite.width -1
            }
            if(polgonVerts[i].x<min.x){
                min.x = polgonVerts[i].x >= 0 ? polgonVerts[i].x: 0
            }
            if(polgonVerts[i].y>max.y){
                max.y = polgonVerts[i].y <= this.sprite.height ? polgonVerts[i].y: this.sprite.height -1
            }
            if(polgonVerts[i].y<min.y){
                min.y = polgonVerts[i].y >= 0 ? polgonVerts[i].y: 0
            }
         }
         
         return [min,max]
    }

    public drawDebug(color:number,collNum:number){
        if(collNum >= this.maxColl){
            this.maxColl = collNum
            this.debugColl.clear()
            this.debugColl.lineStyle(4,color,255)
            this.debugColl.moveTo( - (this.boxColl.position.x*this.anchor.x), - (this.boxColl.position.y*this.anchor.y));

            this.debugColl.lineTo(  (this.boxColl.position.x*(1-this.anchor.x)) /this.scale.x, - (this.boxColl.position.y*this.anchor.y));
            this.debugColl.lineTo(  (this.boxColl.position.x*(1-this.anchor.x)), (this.boxColl.position.y*(1-this.anchor.y)));
            this.debugColl.lineTo( - (this.boxColl.position.x*this.anchor.x),  (this.boxColl.position.y*(1-this.anchor.y)));
            this.debugColl.lineTo( - (this.boxColl.position.x*this.anchor.x), - (this.boxColl.position.y*this.anchor.y));
        }
        
    }

    // public Temp(){
    //     let left =   this.position.x - (this.boxColl.x*this.anchor.x)
    //     let right =  this.position.x + (this.boxColl.x*(1-this.anchor.x))
    //     let top =    this.position.y - (this.boxColl.y*this.anchor.y)
    //     let bottom = this.position.y + (this.boxColl.y*(1-this.anchor.y))
    // }

    
    
}

