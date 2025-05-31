// Funções para o filtro avançado de especialidades
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o filtro
    initFilter();
    
    // Inicializar a busca online
    initOnlineSearch();
});

// Função para inicializar o filtro
function initFilter() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;
    
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const materia = document.getElementById('filter-materia').value.toLowerCase();
        const tema = document.getElementById('filter-tema').value.toLowerCase();
        const palavraChave = document.getElementById('filter-palavra-chave').value.toLowerCase();
        
        // Filtrar os cards de especialidades
        filterSpecialties(materia, tema, palavraChave);
        
        // Se houver palavra-chave, buscar online também
        if (palavraChave) {
            searchOnline(materia, tema, palavraChave);
        }
    });
    
    // Adicionar evento para limpar filtros
    const clearButton = document.getElementById('clear-filter');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            document.getElementById('filter-materia').value = '';
            document.getElementById('filter-tema').value = '';
            document.getElementById('filter-palavra-chave').value = '';
            
            // Mostrar todos os cards
            const cards = document.querySelectorAll('.specialty-card');
            cards.forEach(card => {
                card.style.display = 'block';
            });
            
            // Limpar resultados online
            const onlineResults = document.getElementById('online-results');
            if (onlineResults) {
                onlineResults.innerHTML = '';
                onlineResults.style.display = 'none';
            }
        });
    }
}

// Função para filtrar especialidades
function filterSpecialties(materia, tema, palavraChave) {
    const cards = document.querySelectorAll('.specialty-card');
    let found = false;
    
    cards.forEach(card => {
        const cardTitle = card.querySelector('.specialty-header h2').textContent.toLowerCase();
        const cardContent = card.querySelector('.specialty-content').textContent.toLowerCase();
        const materialItems = card.querySelectorAll('.material-title');
        
        let showCard = true;
        
        // Filtrar por matéria (especialidade)
        if (materia && !cardTitle.includes(materia)) {
            showCard = false;
        }
        
        // Filtrar por tema
        if (tema && showCard) {
            let temaFound = false;
            materialItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(tema)) {
                    temaFound = true;
                }
            });
            
            if (!temaFound && !cardContent.includes(tema)) {
                showCard = false;
            }
        }
        
        // Filtrar por palavra-chave
        if (palavraChave && showCard) {
            let keywordFound = false;
            
            // Verificar no título da especialidade
            if (cardTitle.includes(palavraChave)) {
                keywordFound = true;
            }
            
            // Verificar na descrição
            if (cardContent.includes(palavraChave)) {
                keywordFound = true;
            }
            
            // Verificar nos títulos dos materiais
            materialItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(palavraChave)) {
                    keywordFound = true;
                }
            });
            
            if (!keywordFound) {
                showCard = false;
            }
        }
        
        // Mostrar ou esconder o card
        if (showCard) {
            card.style.display = 'block';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensagem se nenhum resultado for encontrado
    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.style.display = found ? 'none' : 'block';
    }
    
    return found;
}

// Função para buscar online
function searchOnline(materia, tema, palavraChave) {
    const onlineResults = document.getElementById('online-results');
    if (!onlineResults) return;
    
    // Mostrar indicador de carregamento
    onlineResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Buscando resultados online...</div>';
    onlineResults.style.display = 'block';
    
    // Construir a consulta de pesquisa
    let searchQuery = '';
    if (materia) searchQuery += materia + ' ';
    if (tema) searchQuery += tema + ' ';
    if (palavraChave) searchQuery += palavraChave + ' ';
    searchQuery += 'odontologia pdf';
    
    // Simular busca online (em produção, isso seria uma chamada de API real)
    setTimeout(() => {
        // Resultados simulados
        const results = [
            {
                title: "Artigo sobre " + (materia || "Odontologia") + (tema ? " - " + tema : ""),
                description: "Este artigo aborda " + (palavraChave || "tópicos importantes") + " na área de " + (materia || "odontologia"),
                url: "https://example.com/artigo-odontologia.pdf"
            },
            {
                title: "Estudo clínico: " + (tema || "Procedimentos odontológicos"),
                description: "Pesquisa recente sobre " + (palavraChave || "técnicas") + " em " + (materia || "odontologia"),
                url: "https://example.com/estudo-clinico.pdf"
            },
            {
                title: "Manual de referência: " + (materia || "Práticas odontológicas"),
                description: "Guia completo sobre " + (palavraChave || "procedimentos") + " em " + (tema || "odontologia clínica"),
                url: "https://example.com/manual-referencia.pdf"
            }
        ];
        
        // Exibir resultados
        let html = '<h3>Resultados Online</h3><div class="online-results-list">';
        
        results.forEach(result => {
            html += `
                <div class="online-result-item">
                    <h4><a href="${result.url}" target="_blank">${result.title}</a></h4>
                    <p>${result.description}</p>
                    <div class="online-result-actions">
                        <a href="${result.url}" target="_blank" class="material-btn view">Visualizar</a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        onlineResults.innerHTML = html;
    }, 1500);
}

// Função para inicializar a busca online
function initOnlineSearch() {
    const searchButton = document.getElementById('search-online');
    if (!searchButton) return;
    
    searchButton.addEventListener('click', function() {
        const palavraChave = document.getElementById('filter-palavra-chave').value.toLowerCase();
        const materia = document.getElementById('filter-materia').value.toLowerCase();
        const tema = document.getElementById('filter-tema').value.toLowerCase();
        
        if (palavraChave || materia || tema) {
            searchOnline(materia, tema, palavraChave);
        } else {
            alert('Por favor, insira pelo menos uma palavra-chave, matéria ou tema para buscar online.');
        }
    });
}
