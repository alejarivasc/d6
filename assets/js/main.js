const inputPesos = document.querySelector("#inputPesos");
const select = document.querySelector("#select");
const dolar = document.querySelector("#dolar");
const euro = document.querySelector("#euro");
const result = document.querySelector("#result");
const form = document.querySelector("#form");
const myGraph = document.querySelector("#myChart");

const operation = async () => {
  try {
    const response = await fetch(`https://mindicador.cl/api/${select.value}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status} en la petición`);
    }
    const data = await response.json();

    const valor = +data.serie[0].valor;
    const valorTotal = (inputPesos.value / valor).toFixed(2);
    result.innerHTML = `Resultado: $ ${valorTotal}`;
    return data;
  } catch (error) {
    result.textContent = error;
  }
};

const graphic = async (currency) => {
  const ejeX = currency.serie.map((moneda) => {
    return moneda.fecha.slice(0, 10);
  });
  const maxX = ejeX.slice(0, 10);

  const ejeY = currency.serie.map((moneda) => {
    return moneda.valor;
  });

  const config = {
    type: "line",
    data: {
      labels: maxX.reverse(),
      datasets: [
        {
          label: `${select.value}`,
          borderColor: "chocolate",
          fill: false,
          data: ejeY,
        },
      ],
    },
  };
  return config;
};

async function renderGraphic() {
  const currency = await operation();
  const config = await graphic(currency);
  new Chart(myGraph, config);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputPesos.value == 0) {
    alert("Debes ingresar el monto a convertir");
  } else {
    operation();
    renderGraphic();
  }
});
