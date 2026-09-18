
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let produtoEditando = null;

const form = document.querySelector("#formProduto");
const nome = document.querySelector("#nome");
const categoria = document.querySelector("#categoria");
const preco = document.querySelector("#preco");
const estoque = document.querySelector("#estoque");

const lista = document.querySelector("#listaProdutos");
const pesquisa = document.querySelector("#pesquisa");

const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#tituloModal");

const btnAdicionar = document.querySelector("#btnAdicionar");
const fecharModal = document.querySelector("#fecharModal");
const cancelar = document.querySelector("#cancelar");

const quantidade = document.querySelector("#quantidade");

function salvar() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

function mostrarProdutos(produtosMostrar) {
    lista.innerHTML = "";

    quantidade.textContent = produtosMostrar.length + " produtos";

    produtosMostrar.forEach(function(produto, index) {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${index + 1}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.estoque ? "Em estoque" : "Sem estoque"}</td>
            <td>R$ ${Number(produto.preco).toFixed(2)}</td>
            <td>
                <button type="button" class="btn-editar" data-id="${produto.id}">
                    Editar
                </button>

                <button type="button" class="btn-excluir" data-id="${produto.id}">
                    Excluir
                </button>
            </td>
        `;

        linha.querySelector(".btn-editar").addEventListener("click", function() {
            editarProduto(Number(this.dataset.id));
        });

        linha.querySelector(".btn-excluir").addEventListener("click", function() {
            excluirProduto(Number(this.dataset.id));
        });

        lista.appendChild(linha);
    });
}

btnAdicionar.addEventListener("click", function() {
    form.reset();

    produtoEditando = null;

    tituloModal.textContent = "Adicionar produto";

    modal.classList.add("ativo");
});

fecharModal.addEventListener("click", function() {
    modal.classList.remove("ativo");
});

cancelar.addEventListener("click", function() {
    modal.classList.remove("ativo");
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (produtoEditando === null) {

        const novoProduto = {
            id: Date.now(),
            nome: nome.value,
            categoria: categoria.value,
            preco: Number(preco.value),
            estoque: estoque.checked
        };

        produtos.push(novoProduto);

    } else {

        const produto = produtos.find(function(item) {
            return item.id === produtoEditando;
        });

        if (produto) {
            produto.nome = nome.value;
            produto.categoria = categoria.value;
            produto.preco = Number(preco.value);
            produto.estoque = estoque.checked;
        }
    }

    salvar();

    mostrarProdutos(produtos);

    form.reset();

    produtoEditando = null;

    modal.classList.remove("ativo");
});

function editarProduto(id) {

    const produto = produtos.find(function(item) {
        return item.id === id;
    });

    if (!produto) {
        return;
    }

    nome.value = produto.nome;
    categoria.value = produto.categoria;
    preco.value = produto.preco;
    estoque.checked = produto.estoque;

    produtoEditando = id;

    tituloModal.textContent = "Editar produto";

    modal.classList.add("ativo");
}

function excluirProduto(id) {

    if (!confirm("Deseja excluir este produto?")) {
        return;
    }

    produtos = produtos.filter(function(produto) {
        return produto.id !== id;
    });

    salvar();

    mostrarProdutos(produtos);
}

pesquisa.addEventListener("input", function() {

    const texto = pesquisa.value.toLowerCase();

    const resultado = produtos.filter(function(produto) {

        return produto.nome.toLowerCase().includes(texto) ||
               produto.categoria.toLowerCase().includes(texto);

    });

    mostrarProdutos(resultado);
});

mostrarProdutos(produtos);

