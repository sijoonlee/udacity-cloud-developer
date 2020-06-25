export interface CreateRequestToDynamo {
  userId: string
  id: string
  createdAt: string
  title: string, 
  body: string,
  posX: number,
  posY: number,
  width: number,
  height: number,
  isHidden: boolean,
  isDeleted: boolean
}
