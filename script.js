
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELEÇÃO DOS ELEMENTOS
    // ==========================================

    const btnTema = document.querySelector("#btn-tema");
    const iconeTema = document.querySelector("#icone-tema");
    const statusMsg = document.querySelector("#status");

    const btnMostrarMais = document.querySelector("#btn-mostrar-mais");
    const textoExtraSobre = document.querySelector("#texto-extra-sobre");

    const btnMenuHamb = document.querySelector("#btn-menu-hamb");
    const menuNavegacao = document.querySelector("#menu-navegacao");

    const btnToggleAdm = document.querySelector("#btn-toggle-adm");
    const secaoAdmCadastro = document.querySelector("#cadastro-projeto");

    const formCadastro = document.querySelector("#form-cadastro");
    const campoNomeProjeto = document.querySelector("#nome-projeto");
    const campoCategoriaProjeto = document.querySelector("#categoria-projeto");

    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const contadorProjetos = document.querySelector("#contador-projetos");
    const projetosContainer = document.querySelector("#projetos-container");
    const semResultadosMsg = document.querySelector("#sem-resultados");

    const formContato = document.querySelector("#form-contato");
    const campoNome = document.querySelector("#contato-nome");
    const campoEmail = document.querySelector("#contato-email");
    const campoMotivo = document.querySelector("#contato-motivo");
    const containerAssuntoExtra = document.querySelector("#container-assunto-extra");
    const campoAssuntoExtra = document.querySelector("#contato-assunto-extra");
    const campoMensagem = document.querySelector("#contato-mensagem");

    const contadorCaracteres = document.querySelector("#contador-caracteres");
    const resumoErros = document.querySelector("#resumo-erros");
    const btnSubmeterContato = document.querySelector("#btn-submeter-contato");

    let modoAdmAtivo = false;
    let operacaoEmAndamento = false;

    // ==========================================
    // 2. FUNÇÕES AUXILIARES
    // ==========================================

    function normalizar(texto) {
        return (texto || "").trim();
    }

    function exibirStatus(mensagem, tipo = "sucesso") {
        if (!statusMsg) return;

        statusMsg.textContent = mensagem;
        statusMsg.className = tipo;

        setTimeout(() => {
            if (statusMsg.textContent === mensagem) {
                statusMsg.textContent = "";
                statusMsg.className = "";
            }
        }, 6000);
    }

    // ==========================================
    // 3. MODO ESCURO
    // ==========================================

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("escuro");

            const eEscuro = document.body.classList.contains("escuro");

            btnTema.setAttribute("aria-pressed", eEscuro);

            if (iconeTema) {
                iconeTema.textContent = eEscuro ? "🌙" : "☀️";
            }

            exibirStatus(
                `Tema alterado para modo ${eEscuro ? "escuro" : "claro"}.`,
                "sucesso"
            );
        });
    }

    // ==========================================
    // 4. MOSTRAR MAIS / MOSTRAR MENOS
    // ==========================================

    if (btnMostrarMais && textoExtraSobre) {
        btnMostrarMais.addEventListener("click", () => {
            const estaOculto = textoExtraSobre.classList.contains("oculto");

            if (estaOculto) {
                textoExtraSobre.classList.remove("oculto");
                textoExtraSobre.removeAttribute("hidden");

                btnMostrarMais.setAttribute("aria-expanded", "true");
                btnMostrarMais.textContent = "Mostrar menos";

            } else {
                textoExtraSobre.classList.add("oculto");
                textoExtraSobre.setAttribute("hidden", "");

                btnMostrarMais.setAttribute("aria-expanded", "false");
                btnMostrarMais.textContent = "Mostrar mais";
            }
        });
    }

    // ==========================================
    // 5. MENU DROPDOWN
    // ==========================================

    if (btnMenuHamb && menuNavegacao) {

        btnMenuHamb.addEventListener("click", () => {
            const estaOculto = menuNavegacao.classList.contains("oculto");

            if (estaOculto) {
                menuNavegacao.classList.remove("oculto");
                btnMenuHamb.setAttribute("aria-expanded", "true");

            } else {
                menuNavegacao.classList.add("oculto");
                btnMenuHamb.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("click", (e) => {
            if (
                !btnMenuHamb.contains(e.target) &&
                !menuNavegacao.contains(e.target)
            ) {
                menuNavegacao.classList.add("oculto");
                btnMenuHamb.setAttribute("aria-expanded", "false");
            }
        });

        menuNavegacao.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuNavegacao.classList.add("oculto");
                btnMenuHamb.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // 6. MODO ADMINISTRADOR
    // ==========================================

    if (btnToggleAdm && secaoAdmCadastro) {

        btnToggleAdm.addEventListener("click", () => {

            if (!modoAdmAtivo) {

                const senha = prompt(
                    "Digite a senha de Administrador para gerenciar projetos:"
                );

                if (senha === "admin123" || senha === "ryan") {

                    modoAdmAtivo = true;

                    secaoAdmCadastro.classList.remove("oculto");
                    secaoAdmCadastro.removeAttribute("hidden");

                    document.querySelectorAll(".btn-adm-only").forEach(btn => {
                        btn.classList.remove("oculto");
                        btn.removeAttribute("hidden");
                    });

                    btnToggleAdm.textContent = "🔓 Sair do Modo ADM";

                    exibirStatus(
                        "Modo Administrador ativado com sucesso!",
                        "sucesso"
                    );

                } else if (senha !== null) {

                    exibirStatus(
                        "Senha de administrador incorreta.",
                        "erro"
                    );
                }

            } else {

                modoAdmAtivo = false;

                secaoAdmCadastro.classList.add("oculto");
                secaoAdmCadastro.setAttribute("hidden", "");

                document.querySelectorAll(".btn-adm-only").forEach(btn => {
                    btn.classList.add("oculto");
                    btn.setAttribute("hidden", "");
                });

                btnToggleAdm.textContent = "🔒 Modo Administrador";

                exibirStatus(
                    "Modo Administrador desativado.",
                    "sucesso"
                );
            }
        });
    }

    // ==========================================
    // 7. FILTRO DE PROJETOS
    // ==========================================

    function aplicarFiltro(categoriaEscolhida) {

        const cardsProjetos = projetosContainer.querySelectorAll(".projeto");
        let visiveis = 0;

        cardsProjetos.forEach(card => {

            const categoria = card.dataset.categoria || "web";

            if (
                categoriaEscolhida === "todos" ||
                categoria === categoriaEscolhida
            ) {
                card.classList.remove("oculto");
                card.removeAttribute("hidden");
                visiveis++;

            } else {
                card.classList.add("oculto");
                card.setAttribute("hidden", "");
            }
        });

        if (contadorProjetos) {
            contadorProjetos.textContent =
                `Projetos visíveis: ${visiveis}`;
        }

        if (semResultadosMsg) {

            if (visiveis === 0) {
                semResultadosMsg.classList.remove("oculto");
                semResultadosMsg.removeAttribute("hidden");

            } else {
                semResultadosMsg.classList.add("oculto");
                semResultadosMsg.setAttribute("hidden", "");
            }
        }
    }

    botoesFiltro.forEach(btn => {

        btn.addEventListener("click", () => {

            botoesFiltro.forEach(b => {
                b.classList.remove("ativo");
                b.setAttribute("aria-pressed", "false");
            });

            btn.classList.add("ativo");
            btn.setAttribute("aria-pressed", "true");

            aplicarFiltro(btn.dataset.categoria);
        });
    });

    // ==========================================
    // 8. CADASTRAR NOVO PROJETO
    // ==========================================

    if (formCadastro) {

        formCadastro.addEventListener("submit", (e) => {

            e.preventDefault();

            const nomeVal = normalizar(campoNomeProjeto.value);
            const categoriaVal = campoCategoriaProjeto.value;

            if (nomeVal.length < 3) {
                exibirStatus(
                    "O nome do projeto precisa de pelo menos 3 caracteres.",
                    "erro"
                );
                return;
            }

            const novoCard = document.createElement("article");
            novoCard.className = "card projeto";
            novoCard.dataset.categoria = categoriaVal;

            const h3 = document.createElement("h3");
            h3.textContent = nomeVal;

            const pProb = document.createElement("p");
            pProb.innerHTML =
                "<strong>Problema:</strong> Novo projeto cadastrado pelo ADM.";

            const pPub = document.createElement("p");
            pPub.innerHTML =
                "<strong>Público:</strong> Usuários em geral.";

            const pContr = document.createElement("p");
            pContr.innerHTML =
                "<strong>Contribuição:</strong> Implementação autoral.";

            const pTecElem = document.createElement("p");
            pTecElem.className = "tecnologias";

            pTecElem.textContent =
                `Tecnologias: ${
                    categoriaVal === "web"
                        ? "HTML, CSS e JS"
                        : "Mobile Dev"
                }`;

            const divAcoes = document.createElement("div");
            divAcoes.className = "card-acoes";

            const link = document.createElement("a");
            link.href = "https://github.com/RyanSn13";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "botao";
            link.textContent = "Ver Repositório";

            const btnRemover = document.createElement("button");
            btnRemover.type = "button";
            btnRemover.className = "botao remover btn-adm-only";
            btnRemover.textContent = "Remover";

            divAcoes.append(link, btnRemover);

            novoCard.append(
                h3,
                pProb,
                pPub,
                pContr,
                pTecElem,
                divAcoes
            );

            projetosContainer.append(novoCard);

            exibirStatus(
                `Projeto "${nomeVal}" cadastrado com sucesso!`,
                "sucesso"
            );

            formCadastro.reset();

            const filtroAtivo = document.querySelector(".btn-filtro.ativo");

            aplicarFiltro(
                filtroAtivo
                    ? filtroAtivo.dataset.categoria
                    : "todos"
            );
        });
    }

    // ==========================================
    // 9. REMOVER PROJETOS
    // ==========================================

    if (projetosContainer) {

        projetosContainer.addEventListener("click", (e) => {

            const btnRemover = e.target.closest(".remover");

            if (!btnRemover || !modoAdmAtivo) return;

            const card = btnRemover.closest(".projeto");

            if (card) {

                const titulo =
                    card.querySelector("h3")?.textContent || "Projeto";

                card.remove();

                exibirStatus(
                    `Projeto "${titulo}" removido pelo Administrador.`,
                    "sucesso"
                );

                const filtroAtivo =
                    document.querySelector(".btn-filtro.ativo");

                aplicarFiltro(
                    filtroAtivo
                        ? filtroAtivo.dataset.categoria
                        : "todos"
                );
            }
        });
    }

    // ==========================================
    // 10. CONTADOR DE CARACTERES
    // ==========================================

    function atualizarContadorMensagem() {

        if (!campoMensagem || !contadorCaracteres) return;

        const tamanho = normalizar(campoMensagem.value).length;

        contadorCaracteres.textContent =
            `${tamanho} / 1000 caracteres (mínimo 30)`;

        contadorCaracteres.style.color =
            (tamanho < 30 || tamanho > 1000)
                ? "var(--error-color)"
                : "inherit";
    }

    if (campoMensagem) {
        campoMensagem.addEventListener(
            "input",
            atualizarContadorMensagem
        );
    }

    // ==========================================
    // 11. CAMPO DE ASSUNTO CONDICIONAL
    // ==========================================

    function atualizarAssuntoCondicional() {

        if (
            !campoMotivo ||
            !containerAssuntoExtra ||
            !campoAssuntoExtra
        ) return;

        if (campoMotivo.value === "Outro") {

            containerAssuntoExtra.classList.remove("oculto");
            containerAssuntoExtra.removeAttribute("hidden");

            campoAssuntoExtra.required = true;

        } else {

            containerAssuntoExtra.classList.add("oculto");
            containerAssuntoExtra.setAttribute("hidden", "");

            campoAssuntoExtra.required = false;
            campoAssuntoExtra.value = "";

            limparErroCampo(
                campoAssuntoExtra,
                "erro-assunto-extra"
            );
        }
    }

    if (campoMotivo) {
        campoMotivo.addEventListener(
            "change",
            atualizarAssuntoCondicional
        );
    }

    // ==========================================
    // 12. TRATAMENTO DE ERROS
    // ==========================================

    function marcarErroCampo(campo, idSpanErro, mensagem) {

        campo.setAttribute("aria-invalid", "true");

        const spanErro = document.getElementById(idSpanErro);

        if (spanErro) {
            spanErro.textContent = mensagem;
        }
    }

    function limparErroCampo(campo, idSpanErro) {

        campo.removeAttribute("aria-invalid");

        const spanErro = document.getElementById(idSpanErro);

        if (spanErro) {
            spanErro.textContent = "";
        }
    }

    [
        campoNome,
        campoEmail,
        campoMotivo,
        campoAssuntoExtra,
        campoMensagem
    ].forEach(campo => {

        if (!campo) return;

        campo.addEventListener("input", () => {

            const spanId =
                `erro-${
                    campo.name === "assuntoExtra"
                        ? "assunto-extra"
                        : campo.name
                }`;

            limparErroCampo(campo, spanId);

            if (resumoErros) {
                resumoErros.classList.add("oculto");
                resumoErros.setAttribute("hidden", "");
            }
        });
    });

    // ==========================================
    // 13. VALIDAÇÃO DO FORMULÁRIO
    // ==========================================

    function validarFormularioContato() {

        const erros = [];
        let primeiroCampoInvalido = null;

        const nomeVal = normalizar(campoNome.value);

        const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

        if (
            !nomeVal ||
            nomeVal.length < 3 ||
            nomeVal.length > 80 ||
            !regexNome.test(nomeVal)
        ) {

            const msg =
                "Informe seu nome (3 a 80 caracteres contendo apenas letras, acentos e espaços).";

            erros.push({
                campo: campoNome,
                idErro: "erro-nome",
                msg
            });

            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campoNome;
            }

        } else {
            limparErroCampo(campoNome, "erro-nome");
        }

        const emailVal = normalizar(campoEmail.value);

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailVal || !regexEmail.test(emailVal)) {

            const msg =
                "Informe um endereço de e-mail válido (ex: usuario@dominio.com).";

            erros.push({
                campo: campoEmail,
                idErro: "erro-email",
                msg
            });

            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campoEmail;
            }

        } else {
            limparErroCampo(campoEmail, "erro-email");
        }

        if (!campoMotivo.value) {

            const msg = "Selecione o motivo do contato.";

            erros.push({
                campo: campoMotivo,
                idErro: "erro-motivo",
                msg
            });

            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campoMotivo;
            }

        } else {
            limparErroCampo(campoMotivo, "erro-motivo");
        }

        if (campoMotivo.value === "Outro") {

            const assuntoVal = normalizar(campoAssuntoExtra.value);

            if (
                !assuntoVal ||
                assuntoVal.length < 5 ||
                assuntoVal.length > 100
            ) {

                const msg =
                    "Para o motivo 'Outro', informe o assunto adicional (5 a 100 caracteres).";

                erros.push({
                    campo: campoAssuntoExtra,
                    idErro: "erro-assunto-extra",
                    msg
                });

                if (!primeiroCampoInvalido) {
                    primeiroCampoInvalido = campoAssuntoExtra;
                }

            } else {
                limparErroCampo(
                    campoAssuntoExtra,
                    "erro-assunto-extra"
                );
            }
        }

        const mensagemVal = normalizar(campoMensagem.value);

        if (
            !mensagemVal ||
            mensagemVal.length < 30 ||
            mensagemVal.length > 1000
        ) {

            const msg =
                "A mensagem deve conter entre 30 e 1000 caracteres.";

            erros.push({
                campo: campoMensagem,
                idErro: "erro-mensagem",
                msg
            });

            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campoMensagem;
            }

        } else {
            limparErroCampo(campoMensagem, "erro-mensagem");
        }

        return {
            erros,
            primeiroCampoInvalido
        };
    }

    // ==========================================
    // 14. ENVIO DO FORMULÁRIO DE CONTATO
    // ==========================================

    if (formContato) {

        formContato.addEventListener("submit", async (e) => {

            e.preventDefault();

            if (operacaoEmAndamento) return;

            const {
                erros,
                primeiroCampoInvalido
            } = validarFormularioContato();

            if (erros.length > 0) {

                erros.forEach(item => {
                    marcarErroCampo(
                        item.campo,
                        item.idErro,
                        item.msg
                    );
                });

                if (resumoErros) {

                    resumoErros.replaceChildren();

                    const titulo = document.createElement("strong");
                    titulo.textContent =
                        "Atenção: Corrija os erros abaixo antes de enviar:";

                    const lista = document.createElement("ul");

                    erros.forEach(item => {
                        const li = document.createElement("li");
                        li.textContent = item.msg;
                        lista.append(li);
                    });

                    resumoErros.append(titulo, lista);

                    resumoErros.classList.remove("oculto");
                    resumoErros.removeAttribute("hidden");
                }

                if (primeiroCampoInvalido) {
                    primeiroCampoInvalido.focus();
                }

                return;
            }

            if (resumoErros) {
                resumoErros.classList.add("oculto");
                resumoErros.setAttribute("hidden", "");
            }

            operacaoEmAndamento = true;

            btnSubmeterContato.disabled = true;
            btnSubmeterContato.textContent = "Transmitindo mensagem...";

            exibirStatus(
                "Enviando sua mensagem para Ryan Samuel...",
                "sucesso"
            );

            try {

                const formData = new FormData(formContato);

                const response = await fetch(formContato.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Erro na transmissão do formulário.");
                }

                exibirStatus(
                    "Sua mensagem foi entregue com sucesso!",
                    "sucesso"
                );

                formContato.reset();

                atualizarAssuntoCondicional();
                atualizarContadorMensagem();

                [
                    [campoNome, "erro-nome"],
                    [campoEmail, "erro-email"],
                    [campoMotivo, "erro-motivo"],
                    [campoAssuntoExtra, "erro-assunto-extra"],
                    [campoMensagem, "erro-mensagem"]
                ].forEach(([campo, id]) => {
                    limparErroCampo(campo, id);
                });

            } catch (err) {

                exibirStatus(
                    "Não foi possível enviar a mensagem. Tente novamente ou utilize o e-mail de contato.",
                    "erro"
                );

            } finally {

                operacaoEmAndamento = false;

                btnSubmeterContato.disabled = false;
                btnSubmeterContato.textContent = "Enviar mensagem para Ryan";
            }
        });
    }

    // ==========================================
    // 15. INICIALIZAÇÃO
    // ==========================================

    atualizarContadorMensagem();
    atualizarAssuntoCondicional();
    aplicarFiltro("todos");

});
