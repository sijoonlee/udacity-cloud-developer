export interface CreateRequest {
  title: string, 
  body: string,
  posX: number,
  posY: number,
  width: number,
  height: number,
  isHidden: boolean,
  isDeleted: boolean
}