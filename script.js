
const API_KEY = "pro_9198188f7fe0f06cdc6ffaec77b61ac26652a459595f16d76435cbeab60c551e";

const URL = "https://reqres.in/api/collections/products/records?project_id=51113";

let produtos = [];
let produtoEditando = null;
let produtoParaExcluir = null;
let produtoExcluido = null;
let dadosOriginais = null;

const listaProdutos = document.querySelector("#listaProdutos");
const pesquisa = document.querySelector("#pesquisa");
const btnAdicionar = document.querySelector("#btnAdicionar");
const btnTema = document.querySelector("#btnTema");

const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#tituloModal");
const fecharModalBotao = document.querySelector("#fecharModal");
const cancelar = document.querySelector("#cancelar");
const formProduto = document.querySelector("#formProduto");

const nome = document.querySelector("#nome");
const categoria = document.querySelector("#categoria");
const preco = document.querySelector("#preco");
const estoque = document.querySelector("#estoque");

const modalExcluir = document.querySelector("#modalExcluir");
const mensagemExcluir = document.querySelector("#mensagemExcluir");
const cancelarExclusao = document.querySelector("#cancelarExclusao");
const confirmarExclusao = document.querySelector("#confirmarExclusao");

const notificacao = document.querySelector("#notificacao");
const textoNotificacao = document.querySelector("#textoNotificacao");
const desfazer = document.querySelector("#desfazer");

const modalAlteracoes = document.querySelector("#modalAlteracoes");
const continuarEditando = document.querySelector("#continuarEditando");
const sairSemSalvar = document.querySelector("#sairSemSalvar");

let tempoNotificacao;


function mostrarNotificacao(mensagem, mostrarDesfazer = false) {

    clearTimeout(tempoNotificacao);

    textoNotificacao.textContent = mensagem;

    if (mostrarDesfazer) {
        desfazer.style.display = "block";
    } else {
        desfazer.style.display = "none";
    }

    notificacao.classList.add("ativa");

    tempoNotificacao = setTimeout(function() {
        notificacao.classList.remove("ativa");
    }, 4000);
}


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

        produtos = dados.data || [];

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

        return dados.name
            .toLowerCase()
            .includes(textoPesquisa);

    });


    produtosFiltrados.forEach(function(produto, index) {

        const dados = produto.data;

        const linha = document.createElement("tr");

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

            <td>
                ${index + 1}
            </td>

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
                R$ ${Number(dados.price).toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2
                    }
                )}
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

    dadosOriginais = null;

    tituloModal.textContent = "Adicionar produto";

    formProduto.reset();

    modal.style.display = "flex";

});


function fecharModal() {

    modal.style.display = "none";

    produtoEditando = null;

    dadosOriginais = null;

    formProduto.reset();

}


function tentarFecharModal() {

    if (produtoEditando !== null) {

        const dadosAtuais = {

            name: nome.value.trim(),

            category: categoria.value.trim(),

            price: Number(preco.value),

            in_stock: estoque.checked

        };

        const houveAlteracao =
            JSON.stringify(dadosAtuais) !==
            JSON.stringify(dadosOriginais);


        if (houveAlteracao) {

            modalAlteracoes.classList.add("ativo");

            return;

        }

    }

    fecharModal();

}


fecharModalBotao.addEventListener(
    "click",
    tentarFecharModal
);


cancelar.addEventListener(
    "click",
    tentarFecharModal
);


modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        tentarFecharModal();
    }

});


continuarEditando.addEventListener(
    "click",
    function() {

        modalAlteracoes.classList.remove("ativo");

    }
);


sairSemSalvar.addEventListener(
    "click",
    function() {

        modalAlteracoes.classList.remove("ativo");

        fecharModal();

    }
);


modalAlteracoes.addEventListener(
    "click",
    function(event) {

        if (event.target === modalAlteracoes) {

            modalAlteracoes.classList.remove("ativo");

        }

    }
);


formProduto.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nomeProduto = nome.value.trim();

    const categoriaProduto = categoria.value.trim();

    const precoProduto = preco.value;


    if (nomeProduto === "") {

        mostrarNotificacao(
            "Digite o nome do produto."
        );

        nome.focus();

        return;
    }


    if (nomeProduto.length < 3) {

        mostrarNotificacao(
            "O nome deve ter pelo menos 3 caracteres."
        );

        nome.focus();

        return;
    }


    if (categoriaProduto === "") {

        mostrarNotificacao(
            "Digite a categoria do produto."
        );

        categoria.focus();

        return;
    }


    if (precoProduto === "") {

        mostrarNotificacao(
            "Digite o preço do produto."
        );

        preco.focus();

        return;
    }


    if (Number(precoProduto) < 0) {

        mostrarNotificacao(
            "O preço não pode ser negativo."
        );

        preco.focus();

        return;
    }


    const estavaEditando =
        produtoEditando !== null;


    const dadosProduto = {

        name: nomeProduto,

        category: categoriaProduto,

        price: Number(precoProduto),

        in_stock: estoque.checked

    };


    try {

        if (produtoEditando === null) {

            const resposta = await fetch(URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-api-key":
                        API_KEY,

                    "X-Reqres-Env":
                        "prod"

                },

                body: JSON.stringify({

                    data: dadosProduto

                })

            });


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao adicionar produto"
                );

            }

        } else {

            const urlEditar =
                `https://reqres.in/api/collections/products/records/${produtoEditando}?project_id=51113`;


            const resposta = await fetch(
                urlEditar,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-api-key":
                            API_KEY,

                        "X-Reqres-Env":
                            "prod"

                    },

                    body: JSON.stringify({

                        data: dadosProduto

                    })

                }
            );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao editar produto"
                );

            }

        }


        fecharModal();


        if (estavaEditando) {

            mostrarNotificacao(
                "Produto editado com sucesso!"
            );

        } else {

            mostrarNotificacao(
                "Produto adicionado com sucesso!"
            );

        }


        buscarProdutos();


    } catch (erro) {

        console.log(erro);

        mostrarNotificacao(
            "Erro ao salvar o produto."
        );

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


    nome.value =
        produto.data.name;

    categoria.value =
        produto.data.category;

    preco.value =
        produto.data.price;

    estoque.checked =
        produto.data.in_stock;


    dadosOriginais = {

        name:
            produto.data.name,

        category:
            produto.data.category,

        price:
            Number(produto.data.price),

        in_stock:
            produto.data.in_stock

    };


    modal.style.display = "flex";

}


function excluirProduto(id) {

    produtoParaExcluir = id;


    const produto = produtos.find(function(item) {

        return item.id === id;

    });


    if (produto) {

        mensagemExcluir.textContent =
            `Deseja excluir "${produto.data.name}"?`;

    }


    modalExcluir.classList.add("ativo");

}


function fecharModalExclusao() {

    modalExcluir.classList.remove("ativo");

    produtoParaExcluir = null;

}


cancelarExclusao.addEventListener(
    "click",
    fecharModalExclusao
);


modalExcluir.addEventListener("click", function(event) {

    if (event.target === modalExcluir) {
        fecharModalExclusao();
    }

});


confirmarExclusao.addEventListener(
    "click",
    async function() {

        if (!produtoParaExcluir) {
            return;
        }


        const id = produtoParaExcluir;


        const produto = produtos.find(function(item) {

            return item.id === id;

        });


        if (!produto) {
            return;
        }


        produtoExcluido = {

            name:
                produto.data.name,

            category:
                produto.data.category,

            price:
                Number(produto.data.price),

            in_stock:
                produto.data.in_stock

        };


        const urlExcluir =
            `https://reqres.in/api/collections/products/records/${id}?project_id=51113`;


        try {

            confirmarExclusao.disabled = true;


            const resposta = await fetch(
                urlExcluir,
                {

                    method: "DELETE",

                    headers: {

                        "x-api-key":
                            API_KEY,

                        "X-Reqres-Env":
                            "prod"

                    }

                }
            );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao excluir produto"
                );

            }


            fecharModalExclusao();


            mostrarNotificacao(
                "Produto excluído.",
                true
            );


            buscarProdutos();


        } catch (erro) {

            console.log(erro);

            mostrarNotificacao(
                "Erro ao excluir o produto."
            );


        } finally {

            confirmarExclusao.disabled = false;

        }

    }
);


desfazer.addEventListener(
    "click",
    async function() {

        if (!produtoExcluido) {
            return;
        }


        try {

            const resposta = await fetch(
                URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-api-key":
                            API_KEY,

                        "X-Reqres-Env":
                            "prod"

                    },

                    body: JSON.stringify({

                        data:
                            produtoExcluido

                    })

                }
            );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao restaurar produto"
                );

            }


            produtoExcluido = null;


            notificacao.classList.remove(
                "ativa"
            );


            mostrarNotificacao(
                "Produto restaurado com sucesso!"
            );


            buscarProdutos();


        } catch (erro) {

            console.log(erro);

            mostrarNotificacao(
                "Não foi possível restaurar o produto."
            );

        }

    }
);


/* MODO ESCURO */

if (localStorage.getItem("modoEscuro") === "true") {

    document.body.classList.add("dark");

    btnTema.textContent = "☀️";

}


btnTema.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        localStorage.setItem(
            "modoEscuro",
            "true"
        );

        btnTema.textContent = "☀️";

    } else {

        localStorage.setItem(
            "modoEscuro",
            "false"
        );

        btnTema.textContent = "🌙";

    }

});


function visualizarProduto(id) {

    window.location.href =
        `produto-detalhes.html?id=${id}`;

}


/* AVISO DE ALTERAÇÕES */

window.addEventListener(
    "beforeunload",
    function(event) {

        if (produtoEditando !== null) {

            const dadosAtuais = {

                name:
                    nome.value.trim(),

                category:
                    categoria.value.trim(),

                price:
                    Number(preco.value),

                in_stock:
                    estoque.checked

            };


            const houveAlteracao =
                JSON.stringify(dadosAtuais) !==
                JSON.stringify(dadosOriginais);


            if (houveAlteracao) {

                event.preventDefault();

                event.returnValue = "";

            }

        }

    }
);


/* CANVAS */

const canvas =
    document.querySelector("#canvas");

const ctx =
    canvas.getContext("2d");

let pontos = [];

let mouseX = -1000;

let mouseY = -1000;


function ajustarCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    pontos = [];


    for (let i = 0; i < 60; i++) {

        pontos.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            vx:
                (Math.random() - 0.5) *
                0.5,

            vy:
                (Math.random() - 0.5) *
                0.5

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

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

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
                pontos[i].x -
                pontos[j].x;

            const dy =
                pontos[i].y -
                pontos[j].y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
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
                dx * dx +
                dy * dy
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


    requestAnimationFrame(
        animarCanvas
    );

}


ajustarCanvas();

animarCanvas();

buscarProdutos();

