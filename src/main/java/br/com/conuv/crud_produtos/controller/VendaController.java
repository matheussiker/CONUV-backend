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

import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.service.ServicoVendas;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final ServicoVendas servicoVendas;

    public VendaController(ServicoVendas servicoVendas) {
        this.servicoVendas = servicoVendas;
    }

    @GetMapping
    public List<Venda> listar() {
        return servicoVendas.listar();
    }

    @GetMapping("/{id}")
    public Venda buscarPorId(@PathVariable Long id) {
        return servicoVendas.buscarPorId(id);
    }

    @PostMapping
    public Venda salvar(@RequestBody Venda venda) {
        return servicoVendas.salvar(venda);
    }

    @PutMapping("/{id}")
    public Venda atualizar(@PathVariable Long id, @RequestBody Venda venda) {
        return servicoVendas.atualizar(id, venda);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        servicoVendas.excluir(id);
    }
}
