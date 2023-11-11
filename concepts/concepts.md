# Injeção de dependência
    Se uma classe "A", possui dependências de uma classe "B", a injeção de dependência fará com que sejá mais fácil
    e menos acoplado a instanciação dos objetos de "B" para serem usados em "A" via método construtor da classe "A"

    um IOC como o do Nest, facilita a instanciação e injeção desses objetos, usando tokens e providers
    e fazendo com que as classes saibam quais instâncias de quais objetos necessitam para funcionar
    pela injeção via constructor (ver exemploe employee.service.ts)

    O Código fica mais modularizado e testável, visto que sabemos exatamente quais as dependências de uma classe, e conseguimos criar
    stubs e mocks para simular seu comportamento.


