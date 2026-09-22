const API_KEY = "pro_9198188f7fe0f06cdc6ffaec77b61ac26652a459595f16d76435cbeab60c551e";

const URL = "https://reqres.in/api/collections/products/records?project_id=51113";

let produtos = [];
let produtoEditando = null;

const listaProdutos = document.querySelector("#listaProdutos");
const pesquisa = document.querySelector("#pesquisa");
const btnAdicionar = document.querySelector("#btnAdicionar");

const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#tituloModal");
const fecharModalBotao = document.querySelector("#fecharModal");
const cancelar = document.querySelector("#cancelar");
const formProduto = document.querySelector("#formProduto");

const nome = document.querySelector("#nome");
const categoria = document.querySelector("#categoria");
const preco = document.querySelector("#preco");
const estoque = document.querySelector("#estoque");

async function buscarProdutos() {

    try {

        const resposta = await fetch(URL, {

            headers: {
                "x-api-key": API_KEY,
                "X-Reqres-Env": "prod"
            }

        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const dados = await resposta.json();

        produtos = dados.data;

        mostrarProdutos();

    } catch (erro) {

        console.log(erro);

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="6">
                    Não foi possível carregar os produtos.
                </td>
            </tr>
        `;

    }

}

function mostrarProdutos() {

    const textoPesquisa = pesquisa.value.toLowerCase();

    listaProdutos.innerHTML = "";

    const produtosFiltrados = produtos.filter(function(produto) {

        const dados = produto.data;

        return dados.name.toLowerCase().includes(textoPesquisa);

    });

    produtosFiltrados.forEach(function(produto, index) {

        const dados = produto.data;

        const linha = document.createElement("tr");

        linha.style.animationDelay = (index * 0.05) + "s";

        let statusEstoque = "";

        if (dados.in_stock) {

            statusEstoque = `
                <span class="estoque em-estoque">
                    Em estoque
                </span>
            `;

        } else {

            statusEstoque = `
                <span class="estoque sem-estoque">
                    Sem estoque
                </span>
            `;

        }

        linha.innerHTML = `
            <td>${index + 1}</td>

            <td class="nome">
                ${dados.name}
            </td>

            <td class="categoria">
                ${dados.category}
            </td>

            <td>
                ${statusEstoque}
            </td>

            <td class="preco">
                R$ ${Number(dados.price).toFixed(2)}
            </td>

            <td>

                <div class="acoes">

                    <button
                        class="btn-visualizar"
                        onclick="visualizarProduto('${produto.id}')"
                    >
                        👁
                    </button>

                    <button
                        class="btn-editar"
                        onclick="editarProduto('${produto.id}')"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirProduto('${produto.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </td>
        `;

        listaProdutos.appendChild(linha);

    });

}

pesquisa.addEventListener("input", function() {

    mostrarProdutos();

});

btnAdicionar.addEventListener("click", function() {

    produtoEditando = null;

    tituloModal.textContent = "Adicionar produto";

    formProduto.reset();

    modal.style.display = "flex";

});

function fecharModal() {

    modal.style.display = "none";

    produtoEditando = null;

    formProduto.reset();

}

fecharModalBotao.addEventListener("click", fecharModal);

cancelar.addEventListener("click", fecharModal);

modal.addEventListener("click", function(event) {

    if (event.target === modal) {

        fecharModal();

    }

});

formProduto.addEventListener("submit", async function(event) {

    event.preventDefault();

    const dadosProduto = {

        name: nome.value,

        category: categoria.value,

        price: Number(preco.value),

        in_stock: estoque.checked

    };

    try {

        if (produtoEditando === null) {

            const resposta = await fetch(URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "x-api-key": API_KEY,

                    "X-Reqres-Env": "prod"

                },

                body: JSON.stringify({

                    data: dadosProduto

                })

            });

            if (!resposta.ok) {

                throw new Error("Erro ao adicionar produto");

            }

        } else {

            const urlEditar =
                `https://reqres.in/api/collections/products/records/${produtoEditando}?project_id=51113`;

            const resposta = await fetch(urlEditar, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "x-api-key": API_KEY,

                    "X-Reqres-Env": "prod"

                },

                body: JSON.stringify({

                    data: dadosProduto

                })

            });

            if (!resposta.ok) {

                throw new Error("Erro ao editar produto");

            }

        }

        fecharModal();

        buscarProdutos();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao salvar o produto.");

    }

});

function editarProduto(id) {

    const produto = produtos.find(function(item) {

        return item.id === id;

    });

    if (!produto) {

        return;

    }

    produtoEditando = id;

    tituloModal.textContent = "Editar produto";

    nome.value = produto.data.name;

    categoria.value = produto.data.category;

    preco.value = produto.data.price;

    estoque.checked = produto.data.in_stock;

    modal.style.display = "flex";

}

async function excluirProduto(id) {

    const confirmar = confirm(
        "Deseja excluir este produto?"
    );

    if (!confirmar) {

        return;

    }

    const urlExcluir =
        `https://reqres.in/api/collections/products/records/${id}?project_id=51113`;

    try {

        const resposta = await fetch(urlExcluir, {

            method: "DELETE",

            headers: {

                "x-api-key": API_KEY,

                "X-Reqres-Env": "prod"

            }

        });

        if (!resposta.ok) {

            throw new Error("Erro ao excluir produto");

        }

        buscarProdutos();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao excluir o produto.");

    }

}

function visualizarProduto(id) {

    window.location.href =
        `./produto-detalhes.html?id=${id}`;

}

const canvas = document.querySelector("#canvas");

const ctx = canvas.getContext("2d");

let pontos = [];

let mouseX = -1000;

let mouseY = -1000;

function ajustarCanvas() {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    pontos = [];

    for (let i = 0; i < 60; i++) {

        pontos.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height,

            vx: (Math.random() - 0.5) * 0.5,

            vy: (Math.random() - 0.5) * 0.5

        });

    }

}

window.addEventListener(
    "resize",
    ajustarCanvas
);

document.addEventListener(
    "mousemove",
    function(event) {

        mouseX = event.clientX;

        mouseY = event.clientY;

    }
);

function animarCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    pontos.forEach(function(ponto) {

        ponto.x += ponto.vx;

        ponto.y += ponto.vy;

        if (
            ponto.x < 0 ||
            ponto.x > canvas.width
        ) {

            ponto.vx *= -1;

        }

        if (
            ponto.y < 0 ||
            ponto.y > canvas.height
        ) {

            ponto.vy *= -1;

        }

        ctx.beginPath();

        ctx.arc(
            ponto.x,
            ponto.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(37, 99, 235, 0.35)";

        ctx.fill();

    });

    for (
        let i = 0;
        i < pontos.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < pontos.length;
            j++
        ) {

            const dx =
                pontos[i].x - pontos[j].x;

            const dy =
                pontos[i].y - pontos[j].y;

            const distancia =
                Math.sqrt(
                    dx * dx + dy * dy
                );

            if (distancia < 110) {

                ctx.beginPath();

                ctx.moveTo(
                    pontos[i].x,
                    pontos[i].y
                );

                ctx.lineTo(
                    pontos[j].x,
                    pontos[j].y
                );

                ctx.strokeStyle =
                    "rgba(37, 99, 235, 0.18)";

                ctx.lineWidth = 0.2;

                ctx.stroke();

            }

        }

    }

    pontos.forEach(function(ponto) {

        const dx =
            ponto.x - mouseX;

        const dy =
            ponto.y - mouseY;

        const distancia =
            Math.sqrt(
                dx * dx + dy * dy
            );

        if (distancia < 180) {

            ctx.beginPath();

            ctx.moveTo(
                ponto.x,
                ponto.y
            );

            ctx.lineTo(
                mouseX,
                mouseY
            );

            ctx.strokeStyle =
                "rgba(37, 99, 235, 0.5)";

            ctx.lineWidth = 1.5;

            ctx.stroke();

        }

    });

    requestAnimationFrame(animarCanvas);

}

ajustarCanvas();

animarCanvas();

buscarProdutos();

