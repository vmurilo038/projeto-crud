const API_KEY = "pro_9198188f7fe0f06cdc6ffaec77b61ac26652a459595f16d76435cbeab60c551e";

const parametros =
    new URLSearchParams(
        window.location.search
    );

const id =
    parametros.get("id");


const nome =
    document.querySelector("#nome");

const nomeProduto =
    document.querySelector("#nomeProduto");

const categoria =
    document.querySelector("#categoria");

const preco =
    document.querySelector("#preco");

const estoque =
    document.querySelector("#estoque");

const dataCriacao =
    document.querySelector("#dataCriacao");

const idProduto =
    document.querySelector("#idProduto");


const estrelas =
    document.querySelectorAll(".estrela");

const mensagemAvaliacao =
    document.querySelector("#mensagemAvaliacao");


/* PRODUTO */

async function buscarProduto() {

    if (!id) {

        nome.textContent =
            "Produto não encontrado";

        return;

    }


    const URL =
        "https://reqres.in/api/collections/products/records?project_id=51113";


    try {

        const resposta =
            await fetch(
                URL,
                {

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
                "Erro ao buscar produtos"
            );

        }


        const resultado =
            await resposta.json();


        const produto =
            resultado.data.find(
                function(item) {

                    return item.id === id;

                }
            );


        if (!produto) {

            nome.textContent =
                "Produto não encontrado";

            return;

        }


        const dados =
            produto.data;


        nome.textContent =
            dados.name;


        nomeProduto.textContent =
            dados.name;


        categoria.textContent =
            dados.category;


        preco.textContent =
            "R$ " +
            Number(dados.price).toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2
                }
            );


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
                new Date(
                    produto.created_at
                );


            dataCriacao.textContent =
                data.toLocaleString(
                    "pt-BR"
                );

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


/* AVALIAÇÃO */

estrelas.forEach(
    function(estrela) {

        estrela.addEventListener(
            "click",
            function() {

                const valor =
                    Number(
                        estrela.dataset.valor
                    );


                estrelas.forEach(
                    function(item) {

                        const valorItem =
                            Number(
                                item.dataset.valor
                            );


                        if (
                            valorItem <= valor
                        ) {

                            item.classList.add(
                                "ativa"
                            );

                        } else {

                            item.classList.remove(
                                "ativa"
                            );

                        }

                    }
                );


                if (valor === 1) {

                    mensagemAvaliacao.textContent =
                        "Você avaliou com 1 estrela!";

                } else {

                    mensagemAvaliacao.textContent =
                        "Você avaliou com " +
                        valor +
                        " estrelas!";

                }

            }
        );

    }
);


/* MODO ESCURO */

const modoEscuro =
    document.querySelector("#modoEscuro");


if (
    localStorage.getItem(
        "modoEscuro"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

    modoEscuro.textContent =
        "☀️";

}


modoEscuro.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            localStorage.setItem(
                "modoEscuro",
                "true"
            );

            modoEscuro.textContent =
                "☀️";

        } else {

            localStorage.setItem(
                "modoEscuro",
                "false"
            );

            modoEscuro.textContent =
                "🌙";

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


    pontos.forEach(
        function(ponto) {

            ponto.x +=
                ponto.vx;

            ponto.y +=
                ponto.vy;


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

        }
    );


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


                ctx.lineWidth = 1;


                ctx.stroke();

            }

        }

    }


    pontos.forEach(
        function(ponto) {

            const dx =
                ponto.x -
                mouseX;

            const dy =
                ponto.y -
                mouseY;


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


                ctx.lineWidth =
                    1.5;


                ctx.stroke();

            }

        }
    );


    requestAnimationFrame(
        animarCanvas
    );

}


ajustarCanvas();

animarCanvas();

buscarProduto();

