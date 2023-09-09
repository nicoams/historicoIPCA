import express from "express";
import {
  buscarHistorico,
  buscarHistoricoPorAno,
  buscarHistoricoPorID,
  calcularReajuste,
  validarParametros,
} from "./services/service.js";

const app = express();

app.get("/historicoIPCA/calculo", (req, res) => {
  let valor = parseFloat(req.query.valor);
  let mesInicial = parseInt(req.query.mesInicial);
  let anoInicial = parseInt(req.query.anoInicial);
  let mesFinal = parseInt(req.query.mesFinal);
  let anoFinal = parseInt(req.query.anoFinal);

  let parametrosValidados = validarParametros(
    valor,
    mesInicial,
    anoInicial,
    mesFinal,
    anoFinal
  );

  if (parametrosValidados) {
    res.status(400).json(parametrosValidados);
    return;
  }

  const resultado = calcularReajuste(
    valor,
    mesInicial,
    anoInicial,
    mesFinal,
    anoFinal
  );
  res.json({ resultado: resultado });
});

app.get("/historicoIPCA/:id", (req, res) => {
  let idIPCA = parseInt(req.params.id);
  let historicoFiltradoporID = buscarHistoricoPorID(idIPCA);

  if (!historicoFiltradoporID) {
    res.status(400).json({ erro: "ID não encontrado" });
  }

  res.json(historicoFiltradoporID);
});

app.get("/historicoIPCA", (req, res) => {
  let anoBusca = parseInt(req.query.ano);

  if (anoBusca < 2015 || anoBusca > 2023) {
    res.status(400).json({ erro: "Inserir ano entre 2015 e 2023" });
  } else {
    let historico = anoBusca
      ? buscarHistoricoPorAno(anoBusca)
      : buscarHistorico();
    res.json(historico);
  }
});

app.listen(8080, () => {
  console.log("Servidor iniciado");
});
