import historicoInflacao from "../data/data.js";

export const buscarHistorico = () => {
  return historicoInflacao;
};

export const buscarHistoricoPorAno = (ano) => {
  return historicoInflacao.filter((item) => item.ano === ano);
};

export const buscarHistoricoPorID = (id) => {
  return historicoInflacao.find((item) => item.id === id);
};

export const calcularReajuste = (
  valor,
  mesInicial,
  anoInicial,
  mesFinal,
  anoFinal
) => {
  let dataInicial = new Date(anoInicial, mesInicial - 1);
  let dataFinal = new Date(anoFinal, mesFinal - 1);

  let historicoFiltrado = historicoInflacao.filter((item) => {
    const dataItem = new Date(item.ano, item.mes - 1);
    return dataItem >= dataInicial && dataItem <= dataFinal;
  });

  if (historicoFiltrado.length === 0) {
    return valor;
  }

  const resultado = historicoFiltrado.reduce((acc, item) => {
    return acc * (1 + item.ipca / 100);
  }, valor);

  return resultado.toFixed(2);
};

export const validarParametros = (
  valor,
  mesInicial,
  anoInicial,
  mesFinal,
  anoFinal
) => {
  const parametros = [
    { nome: "valor", valor: valor },
    { nome: "mes inicial", valor: mesInicial },
    { nome: "ano inicial", valor: anoInicial },
    { nome: "mes final", valor: mesFinal },
    { nome: "ano final", valor: anoFinal },
  ];

  let dataInicial = new Date(anoInicial, mesInicial - 1);
  let dataFinal = new Date(anoFinal, mesFinal - 1);

  const erros = [];

  if (dataInicial > dataFinal) {
    erros.push(`Insira uma data válida`);
  }

  parametros.forEach((parametro) => {
    if (isNaN(parametro.valor)) {
      erros.push(`Insira um ${parametro.nome} válido.`);
    }

    if (parametro.nome.includes("ano")) {
      if (parametro.valor < 2015 || parametro.valor > 2023) {
        erros.push(`Insira um ${parametro.nome} entre 2015 e 2023`);
      }
    }

    if (
      parametro.nome.includes("mes") &&
      (anoInicial || anoFinal) === 2023 &&
      (parametro.valor < 1 || parametro.valor > 5)
    ) {
      erros.push(
        `Para o ano de 2023, o ${parametro.nome} deve ser entre 1 e 5.`
      );
    } else if (
      parametro.nome.includes("mes") &&
      (parametro.valor < 1 || parametro.valor > 12)
    ) {
      erros.push(`Insira um ${parametro.nome} entre 1 e 12`);
    }
  });

  if (erros.length > 0) {
    return { erros: erros };
  } else {
    return;
  }
};
