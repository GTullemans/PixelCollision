import SpriteObject from "~Objectstuff/SpriteObject";
import Vector2 from "~ExtraStuff/Vector2";
import Mathexta from "~ExtraStuff/Mathextra";
import Polygon from "~geometry/poligon";
import App from "~app";
import { Raster } from "~ExtraStuff/dataStructures";

export default class PixelCollition{
    public static CheckCollision(obj1:SpriteObject,obj2:SpriteObject):boolean{
        return this.BoundingBoxCollision(obj1,obj2)
    }

    public static SuperSlowCollision(obj1:SpriteObject,obj2:SpriteObject):boolean{
        let points1 = obj1.Pixelcoll
        let points2 = obj2.Pixelcoll
       
        let relposx = obj2.position.x - obj1.position.x
        let relposy = obj2.position.y - obj1.position.y
        for(let i = 0;i<points1.length;i++){
            for(let j = 0;j<points1[i].length;j++){
                let p1 = points1[i][j]
                let validposx = Mathexta.Clamp(j + relposx,obj2.sprite.texture.width,0)
                let validposy = Mathexta.Clamp(i + relposy,obj2.sprite.texture.height,0)
                let p2 = points2[validposy][validposx]
                if(p1 &&p2 ){
                    
                    return true
                }
            }
        }
        
        return false
    }

    public static BoundingBoxCollision(obj1:SpriteObject,obj2:SpriteObject):boolean{
        let points1 = obj1.Pixelcoll
        let points2 = obj2.Pixelcoll
        let collider1L = Math.floor(obj1.position.x - (obj1.boxColl.width*obj1.anchor.x))
        let collider1R = Math.floor(obj1.position.x + (obj1.boxColl.width*(1-obj1.anchor.x)))
        let collider1T = Math.floor(obj1.position.y - (obj1.boxColl.height*obj1.anchor.y))
        let collider1B = Math.floor(obj1.position.y + (obj1.boxColl.height*(1-obj1.anchor.y)))
                
        let collider2L = Math.floor(obj2.position.x - (obj2.boxColl.width*obj2.anchor.x))
        let collider2R = Math.floor(obj2.position.x + (obj2.boxColl.width*(1-obj2.anchor.x)))
        let collider2T = Math.floor(obj2.position.y - (obj2.boxColl.height*obj2.anchor.y))
        let collider2B = Math.floor(obj2.position.y + (obj2.boxColl.height*(1-obj2.anchor.y)))

        let top = Math.max(collider1T,collider2T)
        let bottom = Math.min(collider1B,collider2B)
        let left = Math.max(collider1L,collider2L)
        let right = Math.min(collider1R,collider2R)

        console.log(top,bottom,left,right)
        

        for(let y = top;y<bottom;y++){
            for(let x = left;x<right;x++){
                
                let p1 = points1[y - collider1T][x-collider1L]
                let p2 = points2[y - collider2T][x-collider2L]
                
                if(p1 && p2 && p1>50 &&p2 >50){
                    return true
                }
            }
        }
        
        return false
    }

    public static OverlapPolygonCollision(obj1:SpriteObject,obj2:SpriteObject,OverlapPolygon:Polygon){
        //console.time('create Data')
        let vertspoly1 = obj1.getPolygonTransformed(OverlapPolygon)
        let localBox1 = obj1.getPolygonBoundingBox(vertspoly1);
        
        let vertsPoly2 = obj2.getPolygonTransformed(OverlapPolygon);
        let localBox2 = obj2.getPolygonBoundingBox(vertsPoly2)
        
        
        //console.timeEnd('create Data')
        //let alpha = true;
        //let inPolyCheck = true;
        //let transFormCheck = true;
        
        
        let numberOfAlphaChecks = 0;
        let numberOfPolyChecks = 0;
        let numberOfTransforms = 0;
        let numberOfInBox2Checks = 0;
        let numberOf2dAlphaChecks = 0;

        let midX = localBox1[0].x + Math.floor((localBox1[1].x - localBox1[0].x)/2)
        let midY = localBox1[0].y + Math.floor((localBox1[1].y - localBox1[0].y)/2)

        if(this.CheckPixel(midX,midY,obj1,obj2,vertspoly1,localBox2)){
            return {val:true,pixel:new Vector2(midX,midY)}
        }

        // rough check
        let s = this.SampleCheck(obj1,obj2,vertspoly1,localBox1,localBox2)
        if(s?.val){
            return s
        }

        console.group("time to")
        //console.time('first alpha')
        //console.time('first InPoly')
        //console.time('first Transform')
        console.time("polygonCheck")
        console.time("transformCheck")

        

        for(let y = localBox1[0].y;y<localBox1[1].y;y++){
            for(let x = localBox1[0].x;x<localBox1[1].x;x++){
                let pixel1 = obj1.Pixelcoll[y][x]
                numberOfAlphaChecks++
                if(pixel1>50){
                    //if(alpha){
                        //console.timeEnd('first alpha');
                    //    alpha = false
                    //}
                    numberOfPolyChecks++
                    if(numberOfPolyChecks === 10000){
                        
                        console.timeEnd("polygonCheck")
                    }
                    if(Polygon.PointInPolygon(new Vector2(x,y),vertspoly1)){
                        
                        //if(inPolyCheck){
                        //    console.timeEnd('first InPoly')
                        //    inPolyCheck = false
                        //}
                        let rotation = obj1.rotation
                        let rad = (rotation / 180) * Math.PI;
                        let Xnew = x*Math.cos(rad) - y*Math.sin(rad)
                        let Ynew = y*Math.cos(rad) + x*Math.sin(rad)

                        Xnew = Xnew + obj1.position.x - obj2.position.y
                        Ynew = Ynew + obj1.position.y - obj2.position.y
                        Xnew = Math.floor(Xnew)
                        Ynew = Math.floor(Ynew)
                        //if(transFormCheck){
                        //    console.timeEnd('first Transform')
                        //    transFormCheck = false
                        //}
                        numberOfTransforms++
                        if(numberOfTransforms=== 1000){
                            console.timeEnd("transformCheck")
                        }
                        
                            numberOfInBox2Checks++
                            if( Ynew > localBox2[0].y && Ynew < localBox2[1].y &&
                                Xnew > localBox2[0].x && Xnew < localBox2[1].x)
                                numberOf2dAlphaChecks++
                                if(obj2.Pixelcoll[Ynew][Xnew]>50){
                                    if(numberOfPolyChecks<10000){
                                        console.timeEnd("polygonCheck")
                                    }
                                    if(numberOfTransforms< 1000){
                                        console.timeEnd("transformCheck")
                                    }
                                    console.log(`number of Checks total:\n
                                    number of pixel checks: ${numberOfAlphaChecks}\n
                                    number of Point in Polygon Checks: ${numberOfPolyChecks}\n
                                    number of Point transforms: ${numberOfTransforms}\n
                                    number of second box checks ${numberOfInBox2Checks}\n
                                    number of second alpha checks ${numberOf2dAlphaChecks}`)
                                    console.groupEnd()
                                    return {val:true,pixel:new Vector2(x,y)}                             

                                }
                        
                    }
                    
                }
            }
        }
        console.log(`number of Checks total:\n
        number of pixel checks: ${numberOfAlphaChecks}\n
        number of Point in Polygon Checks: ${numberOfPolyChecks}\n
        number of Point transforms: ${numberOfTransforms}\n
        number of second box checks ${numberOfInBox2Checks}\n
        number of second alpha checks ${numberOf2dAlphaChecks}`)
        console.groupEnd()
        return {val:false,pixel:new Vector2(0,0)}
    }

    public static OverlapRasterCollixion(obj1:SpriteObject,obj2:SpriteObject,OverlapPolygon:Polygon){
        let vertspoly1 = obj1.getPolygonTransformed(OverlapPolygon)
        let localBox1 = obj1.getPolygonBoundingBox(vertspoly1);
        
        let vertsPoly2 = obj2.getPolygonTransformed(OverlapPolygon);
        let localBox2 = obj2.getPolygonBoundingBox(vertsPoly2)

        

        let midX = localBox1[0].x + Math.floor((localBox1[1].x - localBox1[0].x)/2)
        let midY = localBox1[0].y + Math.floor((localBox1[1].y - localBox1[0].y)/2)

        if(this.CheckPixel(midX,midY,obj1,obj2,vertspoly1,localBox2)){
            return {val:true,pixel:new Vector2(midX,midY)}
        }

        let cpos1 = obj1.centrePos()
        let cpos2 = obj2.centrePos()

        let dirX = cpos2.x - cpos1.x
        let dirY = cpos2.y - cpos1.y
        let rad = (obj1.rotation / 180) * Math.PI;
        let rotx = dirX*Math.cos(rad) - dirY*Math.sin(rad)
        let roty = dirY*Math.cos(rad) + dirX*Math.sin(rad)
        let loopDirection:LoopDir
        let flip = false
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

        let RasterOvelap = this.RasterInOverlap(localBox1,vertspoly1,obj1.RasterData,loopDirection,flip)
        if(RasterOvelap.length < 1){
            return{val:false,pixel:new Vector2(0,0)}
        }

        for(let r = 0;r<RasterOvelap.length;r++){
            let minX = Math.max(localBox1[0].x,RasterOvelap[r].x)
            let maxX = Math.min(localBox1[1].x,RasterOvelap[r].x + RasterOvelap[r].Width)
            let minY = Math.max(localBox1[0].y,RasterOvelap[r].y)
            let maxY = Math.min(localBox1[1].y,RasterOvelap[r].y +RasterOvelap[r].Height)
            
            let minOuter = flip?minX:minY
            let maxOuter = flip?maxX:maxY
            let minInner = flip?minY:minX
            let maxInner = flip?maxY:maxX
            for(let o = minOuter;o<maxOuter;o++){
                for(let i = minInner;i<maxInner;i++){
                    let n = this.DetermineLoopDir(o,i,maxOuter,maxInner,loopDirection,flip)
                    let x = n[0]
                    let y = n[1]
                    if(this.CheckPixel(x,y,obj1,obj2,vertspoly1,localBox2)){
                        return {val:true,pixel:new Vector2(x,y)}
                    }
                }
            }

        }
        return {val:false,pixel:new Vector2(0,0)}

        
    }

    public static CheckPixel(x:number,y:number,obj1:SpriteObject,obj2:SpriteObject,vertspoly1:Vector2[],localBox2:Vector2[]){
        let pixel1 = obj1.Pixelcoll[y][x]
        //console.time("total")        
        //console.log(x,y)
        if(pixel1>50){
            //console.time("polygonCheck")
            if(Polygon.PointInPolygon(new Vector2(x,y),vertspoly1)){
                //console.timeEnd("polygonCheck")
                //console.time("Transform")
                let rotation = obj1.rotation
                let rad = (rotation / 180) * Math.PI;
                let Xnew = x*Math.cos(rad) - y*Math.sin(rad)
                let Ynew = y*Math.cos(rad) + x*Math.sin(rad)

                Xnew = Xnew + obj1.position.x - obj2.position.y
                Ynew = Ynew + obj1.position.y - obj2.position.y
                Xnew = Math.floor(Xnew)
                Ynew = Math.floor(Ynew)
                //console.timeEnd("Transform")
               
                    if( Ynew > localBox2[0].y && Ynew < localBox2[1].y &&
                        Xnew > localBox2[0].x && Xnew < localBox2[1].x)
                        
                        if(obj2.Pixelcoll[Ynew][Xnew]>50){
                            //console.timeEnd("total")
                            return true                      

                        }
                
            }
            
        }
        //console.timeEnd("total")
        return false
    }

    public static SampleCheck(obj1:SpriteObject,obj2:SpriteObject,vertspoly1:Vector2[],localBox1:Vector2[],localBox2:Vector2[]){
        let devideAmount = 6
        let List:number[][] =[[localBox1[0].x,localBox1[0].y],[localBox1[1].x,localBox1[0].y],[localBox1[0].x,localBox1[1].y],[localBox1[1].x,localBox1[1].y]]
        for(let l = 0;l<List.length;l++){
            if(this.CheckPixel(List[l][0] ,List[l][1],obj1,obj2,vertspoly1,localBox2)){
                return {val:true,pixel:new Vector2(List[l][0] ,List[l][1])}
            }
        }
        let width = localBox1[1].x - localBox1[0].x
        let height = localBox1[1].y - localBox1[0].y
        let currentWidth  = width
        let currentHeight = height
        for(let d = 0;d<devideAmount;d++){
            currentHeight = Math.floor(currentHeight *0.5)
            currentWidth =Math.floor(currentWidth *0.5)
            let toAdd:number[][] = []
            for(let l = 0;l<List.length;l++){
                if(List[l][0] < width){
                    if(this.CheckPixel(List[l][0] + currentWidth,List[l][1],obj1,obj2,vertspoly1,localBox2)){
                        return {val:true,pixel:new Vector2(List[l][0] + currentWidth,List[l][1])}
                    }
                    toAdd.push([List[l][0] + currentWidth,List[l][1]])
                }
                if(List[l][1] < height){
                    if(this.CheckPixel(List[l][0] ,List[l][1]+ currentHeight,obj1,obj2,vertspoly1,localBox2)){

                        return {val:true,pixel:new Vector2(List[l][0] ,List[l][1] + currentHeight)}
                    }
                    toAdd.push([List[l][0] ,List[l][1] + currentHeight])
                }
                if(List[l][0] < width&&List[l][1] < height){
                    if(this.CheckPixel(List[l][0] + currentWidth,List[l][1]+currentHeight,obj1,obj2,vertspoly1,localBox2)){
                        return {val:true,pixel:new Vector2(List[l][0] + currentWidth,List[l][1]+currentHeight)}
                    }
                    toAdd.push([List[l][0] + currentWidth,List[l][1]+currentHeight])
                }
            }
            List.push(...toAdd)

        }
        return{val:false,pixel:new Vector2(0,0)}
    }

    public static RasterInOverlap(boundingBox:Vector2[],vertspoly1:Vector2[],rasterData:Raster[][],loopdir:LoopDir,flip:Boolean){
        let checked:Raster[] = []
        for(let yR = 0; yR<rasterData.length;yR++){      
            
            for(let xR = 0;xR<rasterData[yR].length;xR++){
                
                if(rasterData[yR][xR].x + rasterData[yR][xR].Width > boundingBox[0].x &&                   
                   rasterData[yR][xR].y + rasterData[yR][xR].Height > boundingBox[0].y){
                       

                    if(rasterData[yR][xR].x < boundingBox[1].x){

                        if(rasterData[yR][xR].y < boundingBox[1].y){

                            	if(rasterData[yR][xR].check && Polygon.OverlapRasterPolygon(rasterData[yR][xR],vertspoly1)){
                                    checked.push(rasterData[yR][xR])
                                }
                        }
                        else{
                            return checked
                        }
                        
                    }
                    else{
                        
                        break
                    }
                }

                
                
            }
        }

        return checked
                
    }
    
    private static DetermineLoopDir(outer:number,inner:number,maxOuter:number,maxInner:number,dir:LoopDir,flip:boolean){
        let x = inner
        let y = outer
        switch(dir){
            case LoopDir.Pos:
               if(flip){
                   x = outer
                   y = inner
               }
                break
            case LoopDir.Neg:
                
                if(flip){
                    x = maxOuter -1-outer
                    y = maxInner -1 -inner
                }
                else{
                    x = maxInner -1 -inner
                    y = maxOuter -1-outer
                }
                
                break
            case LoopDir.YNeg:
                if(flip){
                    x  = outer
                    y = maxInner-1-inner
                }
                else{
                    y = maxOuter -1-outer
                }
                
                break
            case LoopDir.XNeg:
                if(flip){
                    x = maxOuter-1-outer
                    y = inner
                }
                else{
                    x = maxInner-1-inner
                }
                
                break

        }
        
        return [x,y]
    }
}

enum LoopDir{
    Pos,
    Neg,
    YNeg,
    XNeg,
}