import Vector2 from "~ExtraStuff/Vector2";
import { Color } from "~ExtraStuff/colors";
import * as PIXI from 'pixi.js'
import Polygon from "./poligon";

export default class Rectangle extends Polygon{
    
    public width:number
    public height:number
    
    
    
    constructor(verts:Vector2[],pos:Vector2,color:Color,alpha:number = 0.5){
        super(verts,pos,color,alpha)
        this.width = verts[1].x - verts[0].x
        this.height = verts[3].y - verts[0].y
        this.DrawGraph = new PIXI.Graphics()
    }

    

    public set setPosition(value:Vector2){
        this.position = value;
        this.DrawPolygon()

    }


    

    

    

    

    DrawRect(){
        this.DrawGraph.clear()
        let verts = this.reletiveVerts
        if(!verts){
            return this.DrawGraph.clear()
        }
        this.DrawGraph.beginFill(this.color)
        this.DrawGraph.drawRect(verts[0].x ,verts[0].y,this.width,this.height)
        
        for(let i = 0 ;i<4;i++){
            Rectangle.drawPoint(verts[i],this.DrawGraph)
        }
        
        
        return this.DrawGraph
    }

    

}



export class Line{
    public vec1:Vector2
    public vec2:Vector2

    constructor(point1:Vector2,point2:Vector2){
        this.vec1 = point1
        this.vec2 = point2
    }

}