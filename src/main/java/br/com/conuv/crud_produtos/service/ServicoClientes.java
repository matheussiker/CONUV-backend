package br.com.conuv.crud_produtos.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.repository.RepositorioClientes;

@Service
public class ServicoClientes {

    private final RepositorioClientes repositorio;

    public ServicoClientes(RepositorioClientes repositorio) {
        this.repositorio = repositorio;
    }

    public Cliente salvar(Cliente cliente) {

        if (cliente.getNome() == null || cliente.getNome().trim().isEmpty()) {
            throw new RuntimeException("O nome do cliente é obrigatório.");
        }

        if (cliente.getCpf() == null || cliente.getCpf().trim().isEmpty()) {
            throw new RuntimeException("O CPF do cliente é obrigatório.");
        }

        if (cliente.getIdade() <= 0) {
            throw new RuntimeException("A idade deve ser maior que zero.");
        }

        return repositorio.save(cliente);
    }

    public List<Cliente> listar() {
        return repositorio.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    public Cliente atualizar(Long id, Cliente cliente) {

        Cliente clienteExistente = buscarPorId(id);

        clienteExistente.setNome(cliente.getNome());
        clienteExistente.setCpf(cliente.getCpf());
        clienteExistente.setIdade(cliente.getIdade());
        clienteExistente.setProfissao(cliente.getProfissao());
        clienteExistente.setEndereco(cliente.getEndereco());

        return salvar(clienteExistente);
    }

    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        repositorio.delete(cliente);
    }
}
