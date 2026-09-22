const API_KEY = "pro_9198188f7fe0f06cdc6ffaec77b61ac26652a459595f16d76435cbeab60c551e";

const parametros = new URLSearchParams(
    window.location.search
);

const id = parametros.get("id");

const nome = document.querySelector("#nome");
const nomeProduto = document.querySelector("#nomeProduto");
const categoria = document.querySelector("#categoria");
const preco = document.querySelector("#preco");
const estoque = document.querySelector("#estoque");
const dataCriacao = document.querySelector("#dataCriacao");
const idProduto = document.querySelector("#idProduto");

const estrelas = document.querySelectorAll(".estrela");
const mensagemAvaliacao = document.querySelector("#mensagemAvaliacao");

async function buscarProduto() {

    if (!id) {

        nome.textContent = "Produto não encontrado";

        return;

    }

    const URL =
        "https://reqres.in/api/collections/products/records?project_id=51113";

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

        const resultado = await resposta.json();

        const produto = resultado.data.find(function(item) {

            return item.id === id;

        });

        if (!produto) {

            nome.textContent = "Produto não encontrado";

            return;

        }

        const dados = produto.data;

        nome.textContent =
            dados.name;

        nomeProduto.textContent =
            dados.name;

        categoria.textContent =
            dados.category;

        preco.textContent =
            `R$ ${Number(dados.price).toFixed(2)}`;

        if (dados.in_stock) {

            estoque.textContent =
                "Em estoque";

            estoque.classList.add(
                "em-estoque"
            );

        } else {

            estoque.textContent =
                "Sem estoque";

            estoque.classList.add(
                "sem-estoque"
            );

        }

        if (produto.created_at) {

            const data =
                new Date(produto.created_at);

            dataCriacao.textContent =
                data.toLocaleString("pt-BR");

        } else {

            dataCriacao.textContent =
                "Não informado";

        }

        idProduto.textContent =
            produto.id;

    } catch (erro) {

        console.log(erro);

        nome.textContent =
            "Erro ao carregar produto";

        nomeProduto.textContent =
            "Não foi possível carregar os dados";

    }

}

estrelas.forEach(function(estrela) {

    estrela.addEventListener("click", function() {

        const valor =
            Number(estrela.dataset.valor);

        estrelas.forEach(function(item) {

            const valorItem =
                Number(item.dataset.valor);

            if (valorItem <= valor) {

                item.classList.add("ativa");

            } else {

                item.classList.remove("ativa");

            }

        });

        mensagemAvaliacao.textContent =
            `Você avaliou com ${valor} estrela${valor > 1 ? "s" : ""}!`;

    });

});

buscarProduto();

