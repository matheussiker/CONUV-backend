
const API_URL = "/vendas";

const form = document.getElementById("vendaForm");
const campoId = document.getElementById("id");
const campoData = document.getElementById("data");
const campoLoja = document.getElementById("loja");
const campoCliente = document.getElementById("cliente");
const campoProduto = document.getElementById("produto");
const campoQuantidade = document.getElementById("quantidade");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const listaVendas = document.getElementById("listaVendas");
const mensagem = document.getElementById("mensagem");

function exibirMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? "red" : "green";
}

async function requisitar(url, metodo = "GET", dados = null) {

    const opcoes = {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (dados !== null) {
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(detalhe || `Erro HTTP ${resposta.status}`);
    }

    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();

    return texto ? JSON.parse(texto) : null;
}

async function carregarOpcoes() {

    const clientes = await requisitar("/clientes");
    const produtos = await requisitar("/produtos");

    campoCliente.replaceChildren();
    campoProduto.replaceChildren();

    const opcaoCliente = document.createElement("option");
    opcaoCliente.value = "";
    opcaoCliente.textContent = "Selecione um cliente";
    campoCliente.appendChild(opcaoCliente);

    clientes.forEach(cliente => {

        const opcao = document.createElement("option");
        opcao.value = cliente.id;
        opcao.textContent = `${cliente.nome} - CPF: ${cliente.cpf}`;

        campoCliente.appendChild(opcao);
    });

    const opcaoProduto = document.createElement("option");
    opcaoProduto.value = "";
    opcaoProduto.textContent = "Selecione um produto";
    campoProduto.appendChild(opcaoProduto);

    produtos.forEach(produto => {

        const opcao = document.createElement("option");
        opcao.value = produto.id;
        opcao.textContent = `${produto.nome} - R$ ${Number(produto.valor).toFixed(2)}`;

        campoProduto.appendChild(opcao);
    });
}

function renderizarVendas(vendas) {

    listaVendas.replaceChildren();

    if (!Array.isArray(vendas)) {
        throw new Error("A resposta da API de vendas não é uma lista.");
    }

    vendas.forEach(venda => {

        const linha = document.createElement("tr");

        function adicionarCelula(valor) {
            const celula = document.createElement("td");
            celula.textContent = valor ?? "";
            linha.appendChild(celula);
        }

        adicionarCelula(venda.id);
        adicionarCelula(venda.data);
        adicionarCelula(venda.loja);
        adicionarCelula(venda.cliente?.nome);
        adicionarCelula(venda.produto?.nome);
        adicionarCelula(venda.quantidade);

        adicionarCelula(
            Number(venda.valorVenda).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        );

        const celulaAcoes = document.createElement("td");
        celulaAcoes.classList.add("acoes");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.type = "button";
        btnEditar.addEventListener("click", () => editarVenda(venda));

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.type = "button";
        btnExcluir.classList.add("excluir");
        btnExcluir.addEventListener("click", () => excluirVenda(venda.id));

        celulaAcoes.append(btnEditar, btnExcluir);
        linha.appendChild(celulaAcoes);

        listaVendas.appendChild(linha);
    });
}

async function carregarVendas() {

    try {
        const vendas = await requisitar(API_URL);
        renderizarVendas(vendas);
    } catch (erro) {
        exibirMensagem(`Erro ao carregar vendas: ${erro.message}`, true);
    }
}

async function editarVenda(venda) {

    try {
        await carregarOpcoes();

        campoId.value = venda.id;
        campoData.value = venda.data;
        campoLoja.value = venda.loja;
        campoCliente.value = venda.cliente.id;
        campoProduto.value = venda.produto.id;
        campoQuantidade.value = venda.quantidade;

        btnSalvar.textContent = "Salvar alterações";
        btnCancelar.hidden = false;

        exibirMensagem(`Editando a venda ${venda.id}.`);

    } catch (erro) {
        exibirMensagem(`Erro ao editar venda: ${erro.message}`, true);
    }
}

function limparFormulario() {

    form.reset();
    campoId.value = "";

    btnSalvar.textContent = "Cadastrar";
    btnCancelar.hidden = true;
}

form.addEventListener("submit", async evento => {

    evento.preventDefault();

    const id = campoId.value;

    const venda = {
        data: campoData.value,
        loja: campoLoja.value.trim(),
        cliente: {
            id: Number(campoCliente.value)
        },
        produto: {
            id: Number(campoProduto.value)
        },
        quantidade: Number(campoQuantidade.value)
    };

    try {

        await requisitar(
            id ? `${API_URL}/${id}` : API_URL,
            id ? "PUT" : "POST",
            venda
        );

        await carregarVendas();

        limparFormulario();

        exibirMensagem(
            id
                ? "Venda atualizada com sucesso!"
                : "Venda cadastrada com sucesso!"
        );

    } catch (erro) {
        exibirMensagem(`Erro ao salvar venda: ${erro.message}`, true);
    }
});

async function excluirVenda(id) {

    if (!confirm("Deseja realmente excluir esta venda?")) {
        return;
    }

    try {

        await requisitar(`${API_URL}/${id}`, "DELETE");

        if (campoId.value === String(id)) {
            limparFormulario();
        }

        await carregarVendas();

        exibirMensagem("Venda excluída com sucesso!");

    } catch (erro) {
        exibirMensagem(`Erro ao excluir venda: ${erro.message}`, true);
    }
}

btnCancelar.addEventListener("click", () => {

    limparFormulario();
    exibirMensagem("Edição cancelada.");

});

async function iniciarPagina() {

    try {
        await carregarOpcoes();
        await carregarVendas();
    } catch (erro) {
        exibirMensagem(`Erro ao carregar dados: ${erro.message}`, true);
    }
}

iniciarPagina();
