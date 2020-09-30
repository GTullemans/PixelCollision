import Vector2 from "~ExtraStuff/Vector2";
import * as PIXI from 'pixi.js'
import { Line } from "./rectangle";
import { Color } from "~ExtraStuff/colors";
import SpriteObject from "~Objectstuff/SpriteObject";
import { Raster } from "~ExtraStuff/dataStructures";

export default  class Polygon{
    public Vertices:Vector2[]
    public Edges:Line[]
    public position:Vector2
    protected DrawGraph:PIXI.Graphics
    protected color:Color
    public Draw:boolean = true
    public rotation:number
    private drawAlpha:number
    private SpriteObject?:SpriteObject
    constructor(verts:Vector2[],pos:Vector2,color:Color,alpha:number = 0.5){
        
        this.Vertices = verts
        this.Edges = []
        this.position = pos
        this.color = color
        this.rotation = 0;
        this.drawAlpha = alpha;
        for(let i = 0;i<verts.length -1;i++){
            this.Edges.push(new Line(verts[i],verts[i+1]))
        }
        this.Edges.push(new Line(verts[verts.length -1],verts[0]));
        this.DrawGraph = new PIXI.Graphics()
    }

    public setSpriteObject(val:SpriteObject){
        this.SpriteObject = val
    }
    public set setPosition(value:Vector2){
        this.position = value;
        this.DrawPolygon()

    }

   public set UpdateVerticies(value:Vector2[]){
        this.Vertices = value
        this.Draw = value.length > 2 ? true:false
        this.DrawPolygon()
   }

   public ConvertToLocal(verts:Vector2[]){
        let relVerts:Vector2[] = []
        if(verts.length === 0) return []
        for(let i = 0 ; i<verts.length;i++){   
        
            relVerts.push(new Vector2(verts[i].x - this.position.x,verts[i].y - this.position.y));
        }
    
        return relVerts
   }

    public get reletiveVerts(){
        let relVerts:Vector2[] = []
        if(this.Vertices.length === 0){
            return relVerts;
        }
        let pos = this.position
        let rot = 0 //this.rotation
        if(this.SpriteObject){
            pos = this.SpriteObject.position
            rot = this.SpriteObject.rotation
        }
        
        let rad = (rot / 180) * Math.PI;
        
            
        for(let i = 0;i<this.Vertices.length;i++){
            let x = this.Vertices[i].x*Math.cos(rad) - this.Vertices[i].y*Math.sin(rad)
            let y = this.Vertices[i].y*Math.cos(rad) + this.Vertices[i].x*Math.sin(rad)
            
        
            relVerts.push(new Vector2(x + pos.x, y + pos.y));

        }
        return relVerts
    }

    public get reletiveEdges(){
        let REdges:Line[] = []
        let verts = this.reletiveVerts
        if(!verts){
            return;
        }
        for(let i = 0;i<verts.length -1;i++){
            REdges.push(new Line(verts[i],verts[i+1]))
        }
        REdges.push(new Line(verts[verts.length -1],verts[0]));

        return REdges
    }

    public set Rotation(val:number){
        this.rotation = val
        
        this.DrawPolygon()
    }

 
    public DrawPolygon(){
        
        let verts = this.Vertices
        if(!this.SpriteObject){
            verts = this.reletiveVerts
        }
        if(!this.Draw||!verts){
            return this.DrawGraph.clear()
        }
        this.DrawGraph.clear()
        this.DrawGraph.beginFill(this.color,this.drawAlpha)
        let pixiPoints:PIXI.Point[] = [];
        for(let i = 0;i<verts.length;i++){
            pixiPoints.push(new PIXI.Point(verts[i].x,verts[i].y))
        }
        this.DrawGraph.drawPolygon(pixiPoints);
        this.DrawGraph.endFill()

        for(let i = 0 ;i<verts.length;i++){
            Polygon.drawPoint(verts[i],this.DrawGraph)
        }

        return this.DrawGraph
    }

    public static LineIntersect(LineA:Line,LineB:Line):Vector2{
        let yAxisA = LineA.vec2.y - LineA.vec1.y
        let xAxisA = LineA.vec1.x - LineA.vec2.x
        let OutcomeA = yAxisA * LineA.vec1.x + xAxisA *LineA.vec1.y

        let yAxisB = LineB.vec2.y - LineB.vec1.y
        let xAxisB = LineB.vec1.x - LineB.vec2.x
        let OutcomeB = yAxisB * LineB.vec1.x + xAxisB *LineB.vec1.y

        let determinant = yAxisA * xAxisB - yAxisB * xAxisA

        if(determinant === 0){
            return new Vector2(Number.NaN,Number.NaN)
        }
        else{
            let x = (xAxisB * OutcomeA - xAxisA * OutcomeB)/determinant
            let y = (yAxisA * OutcomeB - yAxisB * OutcomeA)/determinant
            return new Vector2(x,y)
        }
    }
    public static GetPoligonOverlap(rect1:Polygon,rect2:Polygon,OverlapShape?:Polygon){
        if(!OverlapShape){
            OverlapShape = new Polygon(rect2.Vertices,rect2.position,Color.purple,0.5 )
        }else{
            OverlapShape.position = rect2.position
            OverlapShape.UpdateVerticies = rect2.Vertices

        }
        
        for(let i = 0;i<rect1.Edges.length;i++){
            let Vertices = Polygon.ClipSide(rect1.reletiveEdges![i],OverlapShape)

            
            if(Vertices.length > 2){
                OverlapShape.UpdateVerticies =  OverlapShape.ConvertToLocal(Vertices)    
            }
            else{
                OverlapShape.Draw = false
                OverlapShape.UpdateVerticies = OverlapShape.ConvertToLocal(Vertices)
                break;
            }
            
        }
       
        return OverlapShape
    }

    public static ClipSide(side:Line,subject:Polygon):Vector2[]{
        let NewVerts:Vector2[] = []
        let subEdges = subject.reletiveEdges
        if(!subEdges){
            return []
        }
        for(let e = 0; e<subEdges.length;e++){
            
            let point1 = subEdges[e].vec1;
            let point2 = subEdges[e].vec2;
            
            let Rpoint1 = this.InPolygon(side,point1)
            let Rpoint2 = this.InPolygon(side,point2)

            // both point are inside this polygon edge
            if(Rpoint1 > 0 && Rpoint2 > 0){
                // only point 2 is added to the new shape
                NewVerts.push(point2)
            }
            // point 1 is outside the polygon edge
            else if(Rpoint1 <= 0 && Rpoint2 > 0){
                // intersection point is added
                NewVerts.push(Polygon.LineIntersect(side,new Line(point1,point2)))
                // point 2 is added
                NewVerts.push(point2)
            }
            // point 2 is outside the polygon edge
            else if(Rpoint1 > 0 && Rpoint2 <= 0){
                //only the intersection point is added
                NewVerts.push(Polygon.LineIntersect(side,new Line(point1,point2)))
            }
            // both points are outside the polygon edge
            else{
                // nothing is added
            }

            
        }
        
        return NewVerts;
    }

    public static InPolygon(line:Line,point:Vector2):number{
        return (line.vec2.x - line.vec1.x) * (point.y - line.vec1.y) - (line.vec2.y - line.vec1.y) * (point.x - line.vec1.x)
    }


    public static PointInPolygon(point:Vector2,Polygon:Vector2[]){
        let pos = 0
        let neg = 0
        
        for(let i = 0;i<Polygon.length;i++){
            
            if(Polygon[i].equals(point)) return true

            let i2 = i<Polygon.length -1?i+1:0
            let p1 = Polygon[i]
            let p2 = Polygon[i2]
            let cross =  (point.y-p1.y)*(p2.x-p1.x) - (point.x-p1.x)*(p2.y-p1.y)
            
            if(cross>0)pos++
            if(cross<0)neg++
            
            if(pos>0&&neg>0){
                return false
            }
        }
        return true
    }

    public static OverlapRasterPolygon(raster:Raster,vecArr:Vector2[]){
        for(let ver = 0 ;ver<vecArr.length;ver++){
            if(vecArr[ver].x > raster.x && vecArr[ver].x< raster.x + raster.Width &&
                vecArr[ver].y > raster.y && vecArr[ver].y< raster.y + raster.Height ){
                    return true
                }
        }
        return (this.PointInPolygon(new Vector2(raster.x,raster.y),vecArr)||this.PointInPolygon(new Vector2(raster.x + raster.Width -1,raster.y),vecArr)||
                this.PointInPolygon(new Vector2(raster.x,raster.y + raster.Height -1),vecArr)||this.PointInPolygon(new Vector2(raster.x + raster.Width -1,raster.y +raster.Height -1),vecArr))
    }

    public static drawLine(line:Line,graph:PIXI.Graphics = new PIXI.Graphics()){
        
        graph.lineStyle(2,Color.gray)
        graph.moveTo(line.vec1.x,line.vec1.y);
        graph.lineTo(line.vec2.x,line.vec2.y);
        return graph
    }
    public static drawPoint(point:Vector2,graph:PIXI.Graphics = new PIXI.Graphics()){
        
        graph.lineStyle(3,Color.red)
        graph.drawCircle(point.x,point.y,1);
        return graph
    }
}