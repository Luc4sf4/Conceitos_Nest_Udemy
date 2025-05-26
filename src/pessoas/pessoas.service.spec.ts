/* eslint-disable @typescript-eslint/require-await */
describe('PessoasService', () => {
  beforeEach(async () => {
    console.log('Isso sera executado antes de cada teste');
  });

  //Caso - teste
  it('deve somar num1 e num 2 resultar em 3', () => {
    // configurar -- Arrange
    const num1 = 1;
    const num2 = 2;
    // Fazer alguma ação -- Act
    const result = num1 + num2;
    //Conferir se essa ação foi esperada -- Assert
    // === 3 -> toBe
    expect(result).toBe(3);
  });

  //Outro caso - Teste
  // test('if user can create profile', () => {});

  // // todo describe deve ter teste dentro dele
  // describe('bla bla bla ', () => {
  //   //Caso - teste
  //   it('abc', () => {});
  // });
});
