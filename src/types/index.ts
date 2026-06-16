

export type Roteiro = {
  id?: number,
  titulo: string,
  descricao: string,
  local: string,
  preco: number,
  desconto?: number | null,
  codStatusRoteiro: number,
  codGuia: number,
  codRota: number,
}
