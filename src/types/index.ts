

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


export type Favorito = {
  id?: number,
  codRoteiro: number,
  codPessoa: number,
  roteiro?: Roteiro,
}
