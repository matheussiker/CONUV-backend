package br.com.conuv.crud_produtos.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.entity.Produto;
import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.repository.RepositorioClientes;
import br.com.conuv.crud_produtos.repository.RepositorioProdutos;
import br.com.conuv.crud_produtos.repository.RepositorioVendas;

@Service
public class ServicoVendas {

    private final RepositorioVendas repositorioVendas;
    private final RepositorioClientes repositorioClientes;
    private final RepositorioProdutos repositorioProdutos;

    public ServicoVendas(
            RepositorioVendas repositorioVendas,
            RepositorioClientes repositorioClientes,
            RepositorioProdutos repositorioProdutos) {

        this.repositorioVendas = repositorioVendas;
        this.repositorioClientes = repositorioClientes;
        this.repositorioProdutos = repositorioProdutos;
    }

    public List<Venda> listar() {
        return repositorioVendas.findAll();
    }

    public Venda salvar(Venda venda) {

        if (venda.getCliente() == null || venda.getCliente().getId() == 0) {
            throw new RuntimeException("Selecione um cliente.");
        }

        if (venda.getProduto() == null || venda.getProduto().getId() == 0) {
            throw new RuntimeException("Selecione um produto.");
        }

        if (venda.getQuantidade() <= 0) {
            throw new RuntimeException("A quantidade deve ser maior que zero.");
        }

        Cliente cliente = repositorioClientes.findById(venda.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        Produto produto = repositorioProdutos.findById(venda.getProduto().getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        venda.setCliente(cliente);
        venda.setProduto(produto);

        venda.setValorVenda(produto.getValor() * venda.getQuantidade());

        return repositorioVendas.save(venda);
    }

    public Venda buscarPorId(Long id) {
        return repositorioVendas.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada."));
    }

    public Venda atualizar(Long id, Venda venda) {

        Venda existente = buscarPorId(id);

        existente.setData(venda.getData());
        existente.setLoja(venda.getLoja());
        existente.setCliente(venda.getCliente());
        existente.setProduto(venda.getProduto());
        existente.setQuantidade(venda.getQuantidade());

        return salvar(existente);
    }

    public void excluir(Long id) {
        repositorioVendas.deleteById(id);
    }
}
