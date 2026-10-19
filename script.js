// Recupera as tarefas salvas no navegador
let tarefas = [];
const tarefasSalvas = localStorage.getItem("tarefas");

if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
}


// Captura os elementos do HTML
let filtroAtual = "todas";

const botoesFiltro = document.querySelectorAll(".filtro-tarefa");
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nome-tarefa");
const campoPrioridade = document.getElementById("prioridade-tarefa");
const campoPrazo = document.getElementById("prazo-tarefa");
const listaTarefas = document.getElementById("tarefas-lista");
function tarefaAtrasada(tarefa){
    if(!tarefa.prazo || tarefa.concluida){
        return false
    }

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataHoje = `${ano}-${mes}-${dia}`;
    return tarefa.prazo < dataHoje;
}

function atualizarResumo(){
    const total = tarefas.length;

    const concluidas = tarefas.filter(function(tarefa){
        return tarefa.concluida;
    }).length;
    
    const pendentes = total - concluidas;

    document.getElementById("total-tarefas").textContent = total;
    document.getElementById("tarefas-concluidas").textContent = concluidas;
    document.getElementById("tarefas-pendentes").textContent = pendentes;
}

// Cria visualmente uma tarefa
function criarItemTarefa(tarefa) {

    const item = document.createElement("li");

    // Define o nome da tarefa
    const nome = document.createElement("span");
    nome.textContent = tarefa.nome;

    const prioridade = document.createElement("small");

    const prioridadeAtual = tarefa.prioridade || "media";

    prioridade.textContent =
        "Prioridade: " + prioridadeAtual;

    prioridade.classList.add(
        "prioridade",
        prioridadeAtual
    );
    const prazo = document.createElement("small");

    if(tarefa.prazo){
        const data = tarefa.prazo.split("-");

        prazo.textContent = 
        "Prazo: " + data[2] + "/" + data[1] + "/" + data[0]
     } else {
        prazo.textContent = "Sem prazo definido"
     }
     prazo.classList.add("prazo-tarefa");
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function(evento){
        evento.stopPropagation();

        const indice = tarefas.indexOf(tarefa);
        tarefas.splice(indice, 1);
        localStorage.setItem(
            "tarefas",
            JSON.stringify(tarefas)
        );
        
        mostrarTarefas();
    });

    item.appendChild(nome);
    item.appendChild(prioridade);
    item.appendChild(prazo);
    item.appendChild(botaoExcluir);

    // Verifica se a tarefa já está concluída
    
    // Verifica se a tarefa já está concluída
    if (tarefa.concluida) {
        item.classList.add("concluida");
    }

    // Destaca tarefas com prazo vencido
    if (tarefaAtrasada(tarefa)) {
        item.classList.add("atrasada");
    }


    // Permite marcar e desmarcar a tarefa
    
item.addEventListener("click", function() {
    tarefa.concluida = !tarefa.concluida;

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

    mostrarTarefas();
});


    return item;
}


// Mostra as tarefas salvas quando a página é carregada

function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(function(tarefa) {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    tarefasFiltradas.forEach(function(tarefa) {
        const item = criarItemTarefa(tarefa);
        listaTarefas.appendChild(item);
    });

    atualizarResumo();
}

botoesFiltro.forEach(function(botao) {
    botao.addEventListener("click", function() {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function(outroBotao) {
            const selecionado = outroBotao === botao;

            outroBotao.classList.toggle("ativo", selecionado);
            outroBotao.setAttribute("aria-pressed", selecionado);
        });

        mostrarTarefas();
    });
});



// Mostra as tarefas assim que a página carrega
mostrarTarefas();


// Cadastra uma nova tarefa
formulario.addEventListener("submit", function(evento) {

    // Impede o recarregamento automático da página
    evento.preventDefault();

    // Obtém o texto digitado
    const nomeTarefa = campoTarefa.value.trim();

    // Impede o cadastro de uma tarefa vazia
    if (nomeTarefa === "") {
        return;
    }

    // Cria o objeto da nova tarefa
    const novaTarefa = {
        nome: nomeTarefa,
        concluida: false,
        prioridade: campoPrioridade.value,
        prazo: campoPrazo.value
    };

    // Adiciona a nova tarefa ao array
    tarefas.push(novaTarefa);

    // Salva as tarefas no navegador
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

    // Cria o elemento visual da nova tarefa
    mostrarTarefas();;

    // Limpa o campo
    campoTarefa.value = "";
    // Limpa o campo após cadastrar a tarefa
    campoPrazo.value = "";
    // Coloca o cursor novamente no campo
    campoTarefa.focus();
});