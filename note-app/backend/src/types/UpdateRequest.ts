export interface UpdateRequest {
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
  