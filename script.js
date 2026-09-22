const API_KEY = "pro_9198188f7fe0f06cdc6ffaec77b61ac26652a459595f16d76435cbeab60c551e";

const URL = "https://reqres.in/api/collections/products/records?project_id=51113";

let produtos = [];
let produtoEditando = null;

const lista = document.querySelector("#listaProdutos");
const pesquisa = document.querySelector("#pesquisa");

const form = document.querySelector("#formProduto");
const nome = document.querySelector("#nome");
const categoria = document.querySelector("#categoria");
const preco = document.querySelector("#preco");
const estoque = document.querySelector("#estoque");

const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#tituloModal");

const btnAdicionar = document.querySelector("#btnAdicionar");
const fecharModal = document.querySelector("#fecharModal");
const cancelar = document.querySelector("#cancelar");

async function buscarProdutos() {
    try {
        const resposta = await fetch(URL, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
                "X-Reqres-Env": "prod"
            }
        });

        const dados = await resposta.json();

        produtos = dados.data ;

        mostrarProdutos(produtos);

    } catch (erro) {
        console.error("ERRO:", erro);

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao carregar os produtos
                </td>
            </tr>
        `;
    }
}

function mostrarProdutos(listaProdutos) {
    lista.innerHTML = "";

    if (listaProdutos.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum produto encontrado
                </td>
            </tr>
        `;
        return;
    }

    listaProdutos.forEach(function(produto, index) {

        const dados = produto.data || {};

        const nomeProduto = dados.name || "";
        const categoriaProduto = dados.category || "";
        const precoProduto = dados.price || 0;

        const estoqueProduto =
            dados.in_stock === true ||
            dados.in_stock === "true";

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${index + 1}</td>

            <td>${nomeProduto}</td>

            <td>${categoriaProduto}</td>

            <td>
                ${estoqueProduto ? "Em estoque" : "Sem estoque"}
            </td>

            <td>
                R$ ${Number(precoProduto).toFixed(2).replace(".", ",")}
            </td>

            <td>
                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarProduto('${produto.id}')">
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirProduto('${produto.id}')">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });
}

if (pesquisa) {
    pesquisa.addEventListener("input", function() {

        const texto = pesquisa.value.toLowerCase();

        const produtosFiltrados = produtos.filter(function(produto) {

            const dados = produto.data || {};

            const nomeProduto =
                String(dados.name || "").toLowerCase();

            const categoriaProduto =
                String(dados.category || "").toLowerCase();

            return (
                nomeProduto.includes(texto) ||
                categoriaProduto.includes(texto)
            );
        });

        mostrarProdutos(produtosFiltrados);
    });
}

if (btnAdicionar) {
    btnAdicionar.addEventListener("click", function() {

        produtoEditando = null;

        if (form) {
            form.reset();
        }

        if (tituloModal) {
            tituloModal.textContent = "Adicionar produto";
        }

        if (modal) {
            modal.style.display = "flex";
        }
    });
}

if (fecharModal) {
    fecharModal.addEventListener("click", fecharModalFuncao);
}

if (cancelar) {
    cancelar.addEventListener("click", fecharModalFuncao);
}

function fecharModalFuncao() {

    if (modal) {
        modal.style.display = "none";
    }

    if (form) {
        form.reset();
    }

    produtoEditando = null;
}

if (form) {

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        
        const produto = {
            data: {
                name: nome.value,
                price: Number(preco.value),
                category: categoria.value,
                in_stock: estoque.checked
            }
        };

        try {

            let resposta;

            if (produtoEditando === null) {

                resposta = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                        "X-Reqres-Env": "prod"
                    },
                    body: JSON.stringify(produto)
                });

            } else {

                const url =
                    `https://reqres.in/api/collections/products/records/${produtoEditando}?project_id=51113`;

                resposta = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                        "X-Reqres-Env": "prod"
                    },
                    body: JSON.stringify(produto)
                });
            }

            const dados = await resposta.json();

            alert(
                produtoEditando === null
                    ? "Produto adicionado!"
                    : "Produto editado!"
            );

            fecharModalFuncao();

            await buscarProdutos();

        } catch (erro) {

            console.error(erro);

            alert("Erro: " + erro.message);
        }
    });
}

function editarProduto(id) {

    const produto = produtos.find(function(item) {
        return item.id === id;
    });

    if (!produto) {
        alert("Produto não encontrado");
        return;
    }

    const dados = produto.data || {};

    nome.value = dados.name || "";
    categoria.value = dados.category || "";
    preco.value = dados.price || "";

    estoque.checked =
        dados.in_stock === true ||
        dados.in_stock === "true";

    produtoEditando = id;

    if (tituloModal) {
        tituloModal.textContent = "Editar produto";
    }

    if (modal) {
        modal.style.display = "flex";
    }
}

async function excluirProduto(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const url =
            `https://reqres.in/api/collections/products/records/${id}?project_id=51113`;

        const resposta = await fetch(url, {
            method: "DELETE",
            headers: {
                "x-api-key": API_KEY,
                "X-Reqres-Env": "prod"
            }
        });

        if (!resposta.ok) {

            const dados = await resposta.json().catch(() => ({}));

            throw new Error(
                dados.message || "Erro ao excluir produto"
            );
        }

        alert("Produto excluído!");

        await buscarProdutos();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir: " + erro.message);
    }
}

buscarProdutos();

document.addEventListener("mousemove", function (event) {

    document.body.style.setProperty(
        "--mouse-x",
        event.clientX + "px"
    );

    document.body.style.setProperty(
        "--mouse-y",
        event.clientY + "px"
    );

});
