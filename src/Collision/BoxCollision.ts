import SpriteObject from "~Objectstuff/SpriteObject";

export default class BoxCollision{
    public static CheckBocCollision(coll1:SpriteObject,coll2:SpriteObject):boolean{
                let collider1L = coll1.position.x - (coll1.boxColl.width*coll1.anchor.x)
                let collider1R = coll1.position.x + (coll1.boxColl.width*(1-coll1.anchor.x))
                let collider1T = coll1.position.y - (coll1.boxColl.height*coll1.anchor.y)
                let collider1B = coll1.position.y + (coll1.boxColl.height*(1-coll1.anchor.y))
                
                let collider2L = coll2.position.x - (coll2.boxColl.width*coll2.anchor.x)
                let collider2R = coll2.position.x + (coll2.boxColl.width*(1-coll2.anchor.x))
                let collider2T = coll2.position.y - (coll2.boxColl.height*coll2.anchor.y)
                let collider2B = coll2.position.y + (coll2.boxColl.height*(1-coll2.anchor.y))
        
        
        return((collider1R)>=(collider2L)&&
               (collider1L )<=(collider2R )&&
               (collider1B)>=(collider2T )&&
               (collider1T )<=(collider2B ))
    }
} 