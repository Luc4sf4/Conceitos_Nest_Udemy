//Uma boa pratica seria colocar o readonly, pq a gente vai usar somente para a leitura, nao queremos alterar os dados
export class CreateRecadoDto {
  readonly texto: string;
  readonly de: string;
  readonly para: string;
}
