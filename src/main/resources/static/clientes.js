
const API_URL = "/clientes";

const form = document.getElementById("clienteForm");
const campoId = document.getElementById("id");
const campoNome = document.getElementById("nome");
const campoCpf = document.getElementById("cpf");
const campoIdade = document.getElementById("idade");
const campoProfissao = document.getElementById("profissao");
const campoEndereco = document.getElementById("endereco");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const listaClientes = document.getElementById("listaClientes");
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

function renderizarClientes(clientes) {

    listaClientes.replaceChildren();

    if (!Array.isArray(clientes)) {
        throw new Error("A resposta da API de clientes não é uma lista.");
    }

    clientes.forEach(cliente => {

        const linha = document.createElement("tr");

        function adicionarCelula(valor) {
            const celula = document.createElement("td");
            celula.textContent = valor ?? "";
            linha.appendChild(celula);
        }

        adicionarCelula(cliente.id);
        adicionarCelula(cliente.nome);
        adicionarCelula(cliente.cpf);
        adicionarCelula(cliente.idade);
        adicionarCelula(cliente.profissao);
        adicionarCelula(cliente.endereco);

        const celulaAcoes = document.createElement("td");
        celulaAcoes.classList.add("acoes");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.type = "button";
        btnEditar.addEventListener("click", () => editarCliente(cliente));

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.type = "button";
        btnExcluir.classList.add("excluir");
        btnExcluir.addEventListener("click", () => excluirCliente(cliente.id));

        celulaAcoes.append(btnEditar, btnExcluir);
        linha.appendChild(celulaAcoes);

        listaClientes.appendChild(linha);
    });
}

async function carregarClientes() {

    try {
        const clientes = await requisitar(API_URL);
        renderizarClientes(clientes);
    } catch (erro) {
        exibirMensagem(`Erro ao carregar clientes: ${erro.message}`, true);
    }
}

function editarCliente(cliente) {

    campoId.value = cliente.id;
    campoNome.value = cliente.nome;
    campoCpf.value = cliente.cpf;
    campoIdade.value = cliente.idade;
    campoProfissao.value = cliente.profissao;
    campoEndereco.value = cliente.endereco;

    btnSalvar.textContent = "Salvar alterações";
    btnCancelar.hidden = false;

    exibirMensagem(`Editando o cliente ${cliente.nome}.`);
    campoNome.focus();
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

    const cliente = {
        nome: campoNome.value.trim(),
        cpf: campoCpf.value.trim(),
        idade: Number(campoIdade.value),
        profissao: campoProfissao.value.trim(),
        endereco: campoEndereco.value.trim()
    };

    if (id) {
        cliente.id = Number(id);
    }

    try {

        await requisitar(
            id ? `${API_URL}/${id}` : API_URL,
            id ? "PUT" : "POST",
            cliente
        );

        await carregarClientes();

        limparFormulario();

        exibirMensagem(
            id
                ? "Cliente atualizado com sucesso!"
                : "Cliente cadastrado com sucesso!"
        );

    } catch (erro) {
        exibirMensagem(`Erro ao salvar cliente: ${erro.message}`, true);
    }
});

async function excluirCliente(id) {

    if (!confirm("Deseja realmente excluir este cliente?")) {
        return;
    }

    try {

        await requisitar(
            `${API_URL}/${id}`,
            "DELETE"
        );

        if (campoId.value === String(id)) {
            limparFormulario();
        }

        await carregarClientes();

        exibirMensagem("Cliente excluído com sucesso!");

    } catch (erro) {
        exibirMensagem(`Erro ao excluir cliente: ${erro.message}`, true);
    }
}

btnCancelar.addEventListener("click", () => {

    limparFormulario();
    exibirMensagem("Edição cancelada.");

});

carregarClientes();
