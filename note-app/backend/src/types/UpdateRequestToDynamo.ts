export interface UpdateRequestToDynamo {
  userId: string  
  id: string,
  title: string, 
  body: string,
  posX: number,
  posY: number,
  width: number,
  height: number,
  isHidden: boolean,
  isDeleted: boolean
}
  