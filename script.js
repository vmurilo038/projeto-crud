let produtos = [];

    let produtoEditando = null;


    const btnAdicionar = document.getElementById("btnAdicionar");

    const modal = document.getElementById("modal");

    const fecharModal = document.getElementById("fecharModal");

    const cancelar = document.getElementById("cancelar");

    const form = document.getElementById("formProduto");

    const lista = document.getElementById("listaProdutos");

    const pesquisa = document.getElementById("pesquisa");

    const tituloModal = document.getElementById("tituloModal");

    const nome = document.getElementById("nome");

    const categoria = document.getElementById("categoria");

    const preco = document.getElementById("preco");

    const estoque = document.getElementById("estoque");


    btnAdicionar.onclick = function () {

        produtoEditando = null;

        form.reset();

        tituloModal.textContent = "Adicionar produto";

        modal.classList.add("ativo");

    };


    fecharModal.onclick = function () {

        modal.classList.remove("ativo");

    };


    cancelar.onclick = function () {

        modal.classList.remove("ativo");

    };


    form.onsubmit = function (event) {

        event.preventDefault();


        const produto = {

            id: produtoEditando || Date.now(),

            nome: nome.value,

            categoria: categoria.value,

            preco: Number(preco.value),

            estoque: estoque.checked

        };


        if (produtoEditando === null) {

            produtos.push(produto);

        } else {

            for (let i = 0; i < produtos.length; i++) {

                if (produtos[i].id === produtoEditando) {

                    produtos[i] = produto;

                }

            }

        }


        salvarProdutos();

        mostrarProdutos();

        form.reset();

        modal.classList.remove("ativo");

        produtoEditando = null;

    };


    function mostrarProdutos() {

        lista.innerHTML = "";


        for (let i = 0; i < produtos.length; i++) {

            const produto = produtos[i];


            const linha = document.createElement("tr");


            const numero = document.createElement("td");

            numero.textContent = i + 1;


            const nomeTd = document.createElement("td");

            nomeTd.textContent = produto.nome;

            nomeTd.className = "nome";


            const categoriaTd = document.createElement("td");

            categoriaTd.textContent = produto.categoria;

            categoriaTd.className = "categoria";


            const estoqueTd = document.createElement("td");

            const estoqueSpan = document.createElement("span");

            estoqueSpan.className = "estoque";


            if (produto.estoque) {

                estoqueSpan.classList.add("em-estoque");

                estoqueSpan.textContent = "Em estoque";

            } else {

                estoqueSpan.classList.add("sem-estoque");

                estoqueSpan.textContent = "Sem estoque";

            }


            estoqueTd.appendChild(estoqueSpan);


            const precoTd = document.createElement("td");

            precoTd.className = "preco";

            precoTd.textContent =
                "R$ " + produto.preco.toFixed(2);


            const acoesTd = document.createElement("td");


            const acoes = document.createElement("div");

            acoes.className = "acoes";


            const editar = document.createElement("button");

            editar.type = "button";

            editar.className = "btn-editar";

            editar.textContent = "Editar";


            editar.onclick = function () {

                editarProduto(produto.id);

            };


            const excluir = document.createElement("button");

            excluir.type = "button";

            excluir.className = "btn-excluir";

            excluir.textContent = "Excluir";


            excluir.onclick = function () {

                excluirProduto(produto.id);

            };


            acoes.appendChild(editar);

            acoes.appendChild(excluir);

            acoesTd.appendChild(acoes);


            linha.appendChild(numero);

            linha.appendChild(nomeTd);

            linha.appendChild(categoriaTd);

            linha.appendChild(estoqueTd);

            linha.appendChild(precoTd);

            linha.appendChild(acoesTd);


            lista.appendChild(linha);

        }

    }


    function editarProduto(id) {

        for (let i = 0; i < produtos.length; i++) {

            if (produtos[i].id === id) {

                produtoEditando = id;

                nome.value = produtos[i].nome;

                categoria.value = produtos[i].categoria;

                preco.value = produtos[i].preco;

                estoque.checked = produtos[i].estoque;

                tituloModal.textContent = "Editar produto";

                modal.classList.add("ativo");

                break;

            }

        }

    }


    function excluirProduto(id) {

        const confirmar =
            confirm("Deseja excluir este produto?");


        if (confirmar) {

            produtos = produtos.filter(function (produto) {

                return produto.id !== id;

            });


            salvarProdutos();

            mostrarProdutos();

        }

    }


    pesquisa.oninput = function () {

        const texto = pesquisa.value.toLowerCase();


        const produtosFiltrados = produtos.filter(function (produto) {

            return (
                produto.nome.toLowerCase().includes(texto) ||
                produto.categoria.toLowerCase().includes(texto)
            );

        });


        lista.innerHTML = "";


        for (let i = 0; i < produtosFiltrados.length; i++) {

            const produto = produtosFiltrados[i];

            const linha = document.createElement("tr");


            const numero = document.createElement("td");

            numero.textContent = i + 1;


            const nomeTd = document.createElement("td");

            nomeTd.textContent = produto.nome;

            nomeTd.className = "nome";


            const categoriaTd = document.createElement("td");

            categoriaTd.textContent = produto.categoria;

            categoriaTd.className = "categoria";


            const estoqueTd = document.createElement("td");

            const estoqueSpan = document.createElement("span");

            estoqueSpan.className = "estoque";


            if (produto.estoque) {

                estoqueSpan.classList.add("em-estoque");

                estoqueSpan.textContent = "Em estoque";

            } else {

                estoqueSpan.classList.add("sem-estoque");

                estoqueSpan.textContent = "Sem estoque";

            }


            estoqueTd.appendChild(estoqueSpan);


            const precoTd = document.createElement("td");

            precoTd.className = "preco";

            precoTd.textContent =
                "R$ " + produto.preco.toFixed(2);


            const acoesTd = document.createElement("td");

            const acoes = document.createElement("div");

            acoes.className = "acoes";


            const editar = document.createElement("button");

            editar.type = "button";

            editar.className = "btn-editar";

            editar.textContent = "Editar";

            editar.onclick = function () {

                editarProduto(produto.id);

            };


            const excluir = document.createElement("button");

            excluir.type = "button";

            excluir.className = "btn-excluir";

            excluir.textContent = "Excluir";

            excluir.onclick = function () {

                excluirProduto(produto.id);

            };


            acoes.appendChild(editar);

            acoes.appendChild(excluir);

            acoesTd.appendChild(acoes);


            linha.appendChild(numero);

            linha.appendChild(nomeTd);

            linha.appendChild(categoriaTd);

            linha.appendChild(estoqueTd);

            linha.appendChild(precoTd);

            linha.appendChild(acoesTd);


            lista.appendChild(linha);

        }

    };


    function salvarProdutos() {

        localStorage.setItem(
            "produtos",
            JSON.stringify(produtos)
        );

    }


    function carregarProdutos() {

        const dados =
            localStorage.getItem("produtos");


        if (dados) {

            produtos = JSON.parse(dados);

        }


        mostrarProdutos();

    }


    carregarProdutos();
