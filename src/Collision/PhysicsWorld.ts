import SpriteObject from "~Objectstuff/SpriteObject";
import BoxCollision from "./BoxCollision";
import PixelCollition from "./PixelCollision";
import { Color } from "~ExtraStuff/colors";
import Polygon from "~geometry/poligon";


export default class PhysicsWorld{
    private objects:SpriteObject[]

    constructor(){
        this.objects = []
        
    }

    public addObjects(objs:SpriteObject[]){
        for(let i = 0 ;i<objs.length;i++){
            this.objects.push(objs[i])
        }
    }

    public checkColl(){
        for(let i = 0;i<this.objects.length;i++){
            for(let j = i +1;j<this.objects.length ;j++){
                //console.log(i,j)
                if(!(i===j)){
                let obj = this.objects[i]
                let obj2 = this.objects[j]
                    if(BoxCollision.CheckBocCollision(obj,obj2)){
                        Polygon.GetPoligonOverlap(obj.boxColl,obj2.boxColl)
                        obj.drawDebug(Color.blue,1)
                        obj2.drawDebug(Color.blue,1)
                        console.time('pixelTimeCheck')
                        if(PixelCollition.CheckCollision(obj,obj2)){
                            console.log(`in p coll`)
                            obj.drawDebug(Color.green,2)
                            obj2.drawDebug(Color.green,2)
                            //console.log('pixelCollided')
                        }
                        console.timeEnd('pixelTimeCheck')
                        //onsole.log('collided')
                    }
                    else{
                        obj.drawDebug(Color.red,0)
                        obj2.drawDebug(Color.red,0)
                    }
                }
            }
            this.objects[i].maxColl = 0;
        }
        
    }


}