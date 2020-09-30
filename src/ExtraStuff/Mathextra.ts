export default class Mathexta{
    public static Clamp(value:number,max:number,min:number):number{
        if(value>max)return max
        if(value<min)return min
        else return value
    }

}