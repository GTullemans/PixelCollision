import Vector2 from "~ExtraStuff/Vector2"

export default class PixelConverter{
    

    constructor(){
        

    }

    public static ConvertFromNumberArray(array:number[],width:number,height:number,precision:number = 1,alphaThreshold:number = 10):number[][]{
        let index = 0
        let pixelarray:number[][] = []
        for(let y = 0; y < height;y+= precision){
            pixelarray[y] = []
            for(let x = 0; x < width; x += precision){
                pixelarray[y][x] =  array[index +3]
                    
               
                index+=4
            }
        }

        return pixelarray
    }
}