// base de dados (por 100 g ou 1 unidade)
const alimentos = [
  {
    nome: "Pão de forma (1 fatia)",
    unidade: "un",
    kcal: 65,
    proteina: 2,
    gordura: 1,
    carbo: 12,
  },
  {
    nome: "Manteiga",
    unidade: "g",
    kcal: 747,
    proteina: 0,
    gordura: 83,
    carbo: 0,
  },
  {
    nome: "Goma de tapioca",
    unidade: "g",
    kcal: 220,
    proteina: 0,
    gordura: 0,
    carbo: 55,
  },
  {
    nome: "Pasta de amendoim",
    unidade: "g",
    kcal: 584,
    proteina: 27,
    gordura: 44,
    carbo: 20,
  },
  {
    nome: "Requeijão",
    unidade: "g",
    kcal: 255,
    proteina: 9,
    gordura: 23,
    carbo: 3,
  },
  {
    nome: "Banana",
    unidade: "g",
    kcal: 99,
    proteina: 1.1,
    gordura: 0.3,
    carbo: 23,
  },
  {
    nome: "Ovo inteiro cozido (1 un)",
    unidade: "un",
    kcal: 72,
    proteina: 6.3,
    gordura: 5,
    carbo: 0.4,
  },
  {
    nome: "Ovo só a clara cozido (1 un)",
    unidade: "un",
    kcal: 17,
    proteina: 3.6,
    gordura: 0.0,
    carbo: 0.2,
  },
  {
    nome: "Ovo mexido (1 un)",
    unidade: "un",
    kcal: 72,
    proteina: 6.3,
    gordura: 5,
    carbo: 0.4,
  },
  {
    nome: "Frango grelhado",
    unidade: "g",
    kcal: 156,
    proteina: 31,
    gordura: 3.6,
    carbo: 0,
  },
  {
    nome: "Arroz parboilizado cozido",
    unidade: "g",
    kcal: 125,
    proteina: 2.5,
    gordura: 0.3,
    carbo: 28,
  },
  {
    nome: "Feijão carioca cozido",
    unidade: "g",
    kcal: 80,
    proteina: 4.8,
    gordura: 0.5,
    carbo: 14,
  },
];
const select = document.getElementById("alimento");
const tabela = document.getElementById("tabela");
const totaisDiv = document.getElementById("totais");

let dragIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  atualizarTabela();
});

let itens = JSON.parse(localStorage.getItem("itensDieta")) || [];

alimentos.forEach((a, i) => {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = a.nome;
  select.appendChild(option);
});

function adicionarDivisao() {
  const titulo = prompt("Nome da refeição:", "Nova refeição");

  if (!titulo) return;

  itens.push({
    tipo: "divisao",
    titulo: titulo,
  });

  atualizarTabela();
}

function adicionarAlimento() {
  const alimento = alimentos[select.value];
  const inputQtd = document.getElementById("quantidade");
  const qtd = Number(inputQtd.value);

  let fator = alimento.unidade === "g" ? qtd / 100 : qtd;

  inputQtd.value = "";

  const item = {
    nome: alimento.nome,
    qtd,
    kcal: alimento.kcal * fator,
    proteina: alimento.proteina * fator,
    gordura: alimento.gordura * fator,
    carbo: alimento.carbo * fator,
  };

  itens.push(item);
  atualizarTabela();
}

function editarQtd(index, novaQtd) {
  const qtd = Number(novaQtd);

  // encontrar o alimento original pelo nome
  const alimentoBase = alimentos.find((a) => a.nome === itens[index].nome);
  if (!alimentoBase) return;

  let fator = alimentoBase.unidade === "g" ? qtd / 100 : qtd;

  itens[index].qtd = qtd;
  itens[index].kcal = alimentoBase.kcal * fator;
  itens[index].proteina = alimentoBase.proteina * fator;
  itens[index].gordura = alimentoBase.gordura * fator;
  itens[index].carbo = alimentoBase.carbo * fator;

  atualizarTabela();
}

function remover(index) {
  itens.splice(index, 1);
  atualizarTabela();
}

function atualizarTabela() {
  localStorage.setItem("itensDieta", JSON.stringify(itens));
  tabela.innerHTML = "";

  let totalKcal = 0;
  let totalProteina = 0;
  let totalGordura = 0;
  let totalCarbo = 0;

  itens.forEach((item, i) => {
    if (item.tipo === "divisao") {
      tabela.innerHTML += `
            <tr style="background:#ddd; font-weight:bold">
              <td colspan="7" style="text-align:left">
                ${item.titulo}
                <button class="delete-snack" onclick="remover(${i})" style="float:right">❌</button>
              </td>
            </tr>
          `;
      return;
    }

    if (item.tipo !== "divisao") {
      totalKcal += item.kcal;
      totalProteina += item.proteina;
      totalGordura += item.gordura;
      totalCarbo += item.carbo;
    }

    const row = `
              <tr 
                draggable="true"
                ondragstart="onDragStart(${i})"
                ondragover="onDragOver(event)"
                ondrop="onDrop(${i})"
              >
                <td style="cursor: grab">☰ ${item.nome}</td>
                <td>
                  <input type="number" value="${item.qtd}" min="0" step="1"
                    onchange="editarQtd(${i}, this.value)"
                    style="width:70px">
                </td>
                <td>${item.kcal.toFixed(0)}</td>
                <td>${item.proteina.toFixed(1)} g</td>
                <td>${item.gordura.toFixed(1)} g</td>
                <td>${item.carbo.toFixed(1)} g</td>
                <td><button class="delete-food" onclick="remover(${i})">🗑️</button></td>
              </tr>
            `;

    tabela.innerHTML += row;
  });

  totaisDiv.innerHTML = `
        <strong>Total:</strong> ${totalKcal.toFixed(0)} kcal | 
        <strong>Proteína:</strong> ${totalProteina.toFixed(1)} g | 
        <strong>Gordura:</strong> ${totalGordura.toFixed(1)} g | 
        <strong>Carbo:</strong> ${totalCarbo.toFixed(1)} g
      `;
}

function onDragStart(index) {
  dragIndex = index;
}

function onDragOver(event) {
  event.preventDefault(); // necessário para permitir o drop
}

function onDrop(dropIndex) {
  if (dragIndex === null) return;

  const item = itens[dragIndex];

  itens.splice(dragIndex, 1);
  itens.splice(dropIndex, 0, item);

  dragIndex = null;

  atualizarTabela();
}
