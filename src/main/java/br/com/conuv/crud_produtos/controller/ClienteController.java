package br.com.conuv.crud_produtos.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.service.ServicoClientes;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ServicoClientes servico;

    public ClienteController(ServicoClientes servico) {
        this.servico = servico;
    }

    @GetMapping
    public List<Cliente> listar() {
        return servico.listar();
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Long id) {
        return servico.buscarPorId(id);
    }

    @PostMapping
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        return servico.salvar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return servico.atualizar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        servico.excluir(id);
    }
}
