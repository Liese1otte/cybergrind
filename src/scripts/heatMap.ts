import { blankMap } from "$utils";

// I literally cannot be bothered to decrypt PITR's cubic Bezier bullshit sorry boys.
let heatToColor: {[key: string]: string} = {
    "20": "#ffffff", 
    "19": "#f8f8f8", 
    "18": "#f1f1f1", 
    "17": "#eaeaea", 
    "16": "#e3e3e3", 
    "15": "#dddddd", 
    "14": "#d6d6d6", 
    "13": "#d0d0d0", 
    "12": "#cacaca", 
    "11": "#c3c3c3", 
    "10": "#bdbdbd", 
    "9": "#b7b7b7", 
    "8": "#b1b1b1", 
    "7": "#aaaaaa", 
    "6": "#a4a4a4", 
    "5": "#9d9d9d", 
    "4": "#979797", 
    "3": "#909090", 
    "2": "#898989", 
    "1": "#838383", 
    "0": "#7b7b7b", 
   "-1": "#747474", 
   "-2": "#6d6d6d", 
   "-3": "#656565", 
   "-4": "#5c5c5c", 
   "-5": "#535353", 
   "-6": "#4a4a4a", 
   "-7": "#3f3f3f", 
   "-8": "#333333", 
   "-9": "#232323", 
   "-10": "#000000", 
};

const heatOf = (height: number) => { return height < -10 ? -10 : (height > 20 ? 20 : height)};

export const heatColorOf = (height: number) => { return heatToColor[heatOf(height)]};