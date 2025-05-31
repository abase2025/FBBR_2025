// Integração com API gratuita para busca de respostas online
document.addEventListener('DOMContentLoaded', function() {
    const aiChatButton = document.getElementById('ai-chat-button');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiChatSend = document.getElementById('ai-chat-send');
    const aiChatInputField = document.getElementById('ai-chat-input-field');
    const aiChatBody = document.getElementById('ai-chat-body');
    
    if (aiChatButton) {
        aiChatButton.addEventListener('click', () => {
            aiChatWindow.style.display = 'flex';
        });
    }
    
    if (aiChatClose) {
        aiChatClose.addEventListener('click', () => {
            aiChatWindow.style.display = 'none';
        });
    }
    
    if (aiChatSend) {
        aiChatSend.addEventListener('click', sendMessage);
    }
    
    if (aiChatInputField) {
        aiChatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Função para buscar informações online usando a API gratuita do Wikipedia
    async function searchOnline(query) {
        try {
            // Construir URL para a API do Wikipedia
            const searchUrl = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            
            // Fazer a requisição
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            // Verificar se há resultados
            if (data.query && data.query.search && data.query.search.length > 0) {
                // Pegar o primeiro resultado
                const firstResult = data.query.search[0];
                
                // Buscar o conteúdo completo do artigo
                const contentUrl = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(firstResult.title)}&format=json&origin=*`;
                const contentResponse = await fetch(contentUrl);
                const contentData = await contentResponse.json();
                
                // Extrair o conteúdo
                const pages = contentData.query.pages;
                const pageId = Object.keys(pages)[0];
                const extract = pages[pageId].extract;
                
                // Formatar a resposta
                return {
                    success: true,
                    title: firstResult.title,
                    extract: extract,
                    url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`
                };
            } else {
                // Sem resultados
                return {
                    success: false,
                    message: "Não encontrei informações específicas sobre isso. Tente reformular sua pergunta."
                };
            }
        } catch (error) {
            console.error("Erro ao buscar informações online:", error);
            return {
                success: false,
                message: "Desculpe, ocorreu um erro ao buscar informações online. Tente novamente mais tarde."
            };
        }
    }
    
    // Função para verificar se a pergunta é sobre odontologia
    function isDentalQuestion(query) {
        const dentalKeywords = [
            'dente', 'dental', 'odonto', 'odontologia', 'gengiva', 'canal', 'cárie', 'periodontia',
            'endodontia', 'ortodontia', 'prótese', 'implante', 'extração', 'restauração',
            'anestesia', 'braquete', 'aparelho', 'dentista', 'odontológico', 'pulpite',
            'farmacologia', 'oclusão', 'atm', 'mandíbula', 'maxilar', 'bucal', 'oral'
        ];
        
        query = query.toLowerCase();
        return dentalKeywords.some(keyword => query.includes(keyword));
    }
    
    // Função para obter resposta local baseada em palavras-chave
    function getLocalResponse(message) {
        message = message.toLowerCase();
        
        // Farmacologia
        if (message.includes('farmaco') || message.includes('farmacologia')) {
            return "A Farmacologia em Odontologia estuda os medicamentos utilizados na prática odontológica. Temos 5 materiais disponíveis sobre analgésicos, anti-inflamatórios, antibióticos, anestésicos locais e interações medicamentosas. Você pode acessá-los na seção de Farmacologia da página de Especialidades. Recomendo especialmente o material 'farmaco2.pdf' que aborda os antibióticos mais utilizados na odontologia.";
        } 
        // Endodontia
        else if (message.includes('endodontia') || message.includes('canal')) {
            return "A Endodontia é a especialidade que estuda a polpa dentária e os tecidos periapicais. Temos 5 materiais disponíveis sobre este tema, incluindo anatomia interna dos dentes, técnicas de instrumentação, obturação e tratamento de urgências endodônticas. Você pode acessá-los na seção de Endodontia da página de Especialidades. O material 'Endodontia-Introduçãoeanatomiainternadosdentes.pdf' é excelente para iniciantes.";
        } 
        // Ortodontia
        else if (message.includes('ortodontia') || message.includes('aparelho')) {
            return "A Ortodontia trata da correção das estruturas dento-faciais. Temos 6 materiais sobre classificação das más oclusões, desenvolvimento da dentição, etiologia das más oclusões, mordida aberta e mantenedores de espaço. Acesse-os na seção de Ortodontia da página de Especialidades. Para entender as classificações, recomendo começar pelo material 'ORTODONTIA-Classificaçãodasmásoclusões.pdf'.";
        } 
        // Periodontia
        else if (message.includes('periodontia') || message.includes('gengiva')) {
            return "A Periodontia estuda os tecidos de suporte dos dentes. Temos um material completo sobre a nova classificação das doenças periodontais, abordando desde gengivite até periodontite avançada. Você pode acessá-lo na seção de Periodontia da página de Especialidades. O material 'Periodontia-CompletoNovaClassificação.pdf' é atualizado com as diretrizes mais recentes.";
        } 
        // Prótese
        else if (message.includes('prótese') || message.includes('protese')) {
            return "A Prótese Dentária visa a reconstrução de dentes danificados ou ausentes. Temos materiais sobre prótese parcial removível, prótese total e conceitos fundamentais. Acesse-os na seção de Prótese Dentária da página de Especialidades. Para próteses parciais removíveis, recomendo o material 'PÓTESEPARCIALREMOVIVEL.pdf' que aborda classificações e planejamento.";
        } 
        // Anestesiologia
        else if (message.includes('anestesia') || message.includes('anestesiologia')) {
            return "A Anestesiologia em Odontologia estuda os mecanismos de controle da dor. Temos 5 materiais disponíveis sobre considerações anatômicas, técnicas e manejos, complicações e emergências. Você pode acessá-los na seção de Anestesiologia da página de Especialidades. O material 'ANESTESIA-TÉCNICASEMANEJOS.pdf' é excelente para aprender as técnicas mais utilizadas.";
        } 
        // Cariologia
        else if (message.includes('cariologia') || message.includes('cárie')) {
            return "A Cariologia estuda a doença cárie, desde sua etiologia até seu tratamento. Temos materiais sobre evolução da cárie, diagnóstico e prevenção. Acesse-os na seção de Cariologia da página de Especialidades. O material 'CARIOLOGIA-Evoluçãodacárie.pdf' explica detalhadamente o processo de desenvolvimento da cárie.";
        }
        // Dentística
        else if (message.includes('dentística') || message.includes('dentistica') || message.includes('restauração')) {
            return "A Dentística é a especialidade responsável pelos procedimentos restauradores diretos. Temos materiais completos sobre técnicas restauradoras, materiais e procedimentos estéticos. Acesse-os na seção de Dentística da página de Especialidades. O material 'Dentisticacompleto.pdf' abrange desde preparos cavitários até restaurações complexas.";
        }
        // Materiais Odontológicos
        else if (message.includes('materiais') || message.includes('material odontológico')) {
            return "Os Materiais Odontológicos são fundamentais para a prática clínica. Temos materiais sobre materiais restauradores, cimentos, ligas metálicas e biomateriais. Acesse-os na seção de Materiais da página de Especialidades. O material 'MATERIAISODONTOLOGICOS-MATERIAISRESTAURADORES.pdf' é uma excelente referência para resinas compostas e amálgama.";
        }
        // Oclusão
        else if (message.includes('oclusão') || message.includes('oclusao') || message.includes('atm')) {
            return "A Oclusão estuda as relações de contato entre os dentes e a articulação temporomandibular. Temos materiais sobre princípios de oclusão, disfunções temporomandibulares e ajuste oclusal. Acesse-os na seção de Oclusão da página de Especialidades. O material 'oclusao.pdf' aborda os conceitos fundamentais para entender este tema complexo.";
        }
        // Odontologia Legal
        else if (message.includes('odontologia legal') || message.includes('forense')) {
            return "A Odontologia Legal aplica os conhecimentos odontológicos a serviço da justiça. Temos materiais sobre identificação humana, traumatologia forense e documentação odontológica. Acesse-os na seção de Odontologia Legal da página de Especialidades. O material 'odontolegal.pdf' é uma introdução completa a esta fascinante especialidade.";
        }
        // Especialidades gerais
        else if (message.includes('especialidade')) {
            return "O FBBR_Odonto oferece materiais para diversas especialidades odontológicas, como Endodontia, Ortodontia, Periodontia, Prótese Dentária, Anestesiologia, Cariologia, Dentística, Farmacologia, Materiais Odontológicos, Oclusão e Odontologia Legal. Qual delas você gostaria de explorar? Cada especialidade tem materiais específicos organizados para facilitar seu estudo.";
        } 
        // Materiais/PDFs
        else if (message.includes('material') || message.includes('pdf')) {
            return "Temos mais de 40 materiais em PDF disponíveis para download gratuito, organizados por especialidade. Você pode acessá-los através da página de Especialidades ou Resumos. Todos os PDFs podem ser visualizados diretamente no navegador ou baixados para estudo offline. Qual área específica você está procurando?";
        } 
        // Questões
        else if (message.includes('questão') || message.includes('prova') || message.includes('exercício')) {
            return "Na seção de Questões, você encontrará exercícios e questões de provas anteriores para testar seus conhecimentos. As questões estão organizadas por especialidade e nível de dificuldade. Você pode filtrar por tema específico e receber feedback imediato sobre suas respostas. Acesse a página de Questões para começar a praticar.";
        }
        // Saudações
        else if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
            return "Olá! Sou o DON_FBBR-A sua Inteligência Artificial, seu assistente virtual de estudos em Odontologia. Como posso ajudar você hoje? Posso fornecer informações sobre especialidades, recomendar materiais de estudo ou responder dúvidas sobre odontologia. Estou aqui para facilitar seu aprendizado!";
        }
        // Agradecimentos
        else if (message.includes('obrigado') || message.includes('obrigada') || message.includes('valeu') || message.includes('agradeço')) {
            return "Por nada! Estou aqui para ajudar com seus estudos em Odontologia. Se tiver mais perguntas ou precisar de mais informações, é só me chamar. Bons estudos!";
        }
        // Sobre o site
        else if (message.includes('site') || message.includes('plataforma') || message.includes('fbbr')) {
            return "O FBBR_Odonto é uma plataforma educacional gratuita dedicada ao estudo da Odontologia. Oferecemos materiais de estudo, resumos, questões e recursos para todas as especialidades odontológicas. O site foi desenvolvido por Harrison Costa para auxiliar estudantes e profissionais em sua jornada de aprendizado contínuo.";
        }
        // Sobre o DON_FBBR
        else if (message.includes('quem é você') || message.includes('don_fbbr') || message.includes('assistente')) {
            return "Eu sou DON_FBBR-A sua Inteligência Artificial, um assistente virtual especializado em Odontologia. Fui criado para ajudar estudantes e profissionais a encontrar informações, materiais de estudo e responder dúvidas sobre as diversas especialidades odontológicas. Estou em constante aprendizado para oferecer o melhor suporte possível!";
        }
        
        return null; // Retorna null se não encontrar resposta local
    }
    
    async function sendMessage() {
        if (!aiChatInputField || !aiChatBody) return;
        
        const message = aiChatInputField.value.trim();
        if (message) {
            // Adicionar mensagem do usuário
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'user-message';
            userMessageDiv.innerHTML = `<p><strong>Você:</strong> ${message}</p>`;
            aiChatBody.appendChild(userMessageDiv);
            
            // Limpar campo de entrada
            aiChatInputField.value = '';
            
            // Mostrar indicador de digitação
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-message typing-indicator';
            typingDiv.innerHTML = '<p><strong>DON_FBBR:</strong> <span class="typing-animation">Buscando informações...</span></p>';
            aiChatBody.appendChild(typingDiv);
            
            // Rolar para o final da conversa
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
            
            // Verificar se temos uma resposta local primeiro
            const localResponse = getLocalResponse(message);
            
            // Processar a resposta
            setTimeout(async () => {
                // Remover indicador de digitação
                aiChatBody.removeChild(typingDiv);
                
                // Criar elemento para resposta
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'ai-message';
                
                let finalResponse = "";
                
                // Se temos uma resposta local, usá-la
                if (localResponse) {
                    finalResponse = localResponse;
                } 
                // Se é uma pergunta sobre odontologia, buscar online
                else if (isDentalQuestion(message)) {
                    // Adicionar "odontologia" à busca para melhorar resultados
                    const searchQuery = message + " odontologia";
                    const onlineResult = await searchOnline(searchQuery);
                    
                    if (onlineResult.success) {
                        finalResponse = `<strong>${onlineResult.title}</strong><br><br>${onlineResult.extract}<br><br><em>Fonte: <a href="${onlineResult.url}" target="_blank">Wikipedia</a></em><br><br>Espero que esta informação ajude! Se precisar de mais detalhes ou tiver outras dúvidas, estou à disposição.`;
                    } else {
                        finalResponse = `${onlineResult.message} Você pode tentar perguntar sobre alguma especialidade específica da odontologia ou consultar nossos materiais na seção de Especialidades.`;
                    }
                } 
                // Para perguntas gerais, buscar online sem adicionar "odontologia"
                else {
                    const onlineResult = await searchOnline(message);
                    
                    if (onlineResult.success) {
                        finalResponse = `<strong>${onlineResult.title}</strong><br><br>${onlineResult.extract}<br><br><em>Fonte: <a href="${onlineResult.url}" target="_blank">Wikipedia</a></em><br><br>Espero que esta informação ajude! Se precisar de mais detalhes ou tiver outras dúvidas, estou à disposição.`;
                    } else {
                        finalResponse = `${onlineResult.message} Você pode tentar reformular sua pergunta ou perguntar sobre temas relacionados à odontologia, onde posso ajudar melhor.`;
                    }
                }
                
                botMessageDiv.innerHTML = `<p><strong>DON_FBBR:</strong> ${finalResponse}</p>`;
                aiChatBody.appendChild(botMessageDiv);
                
                // Rolar para o final da conversa
                aiChatBody.scrollTop = aiChatBody.scrollHeight;
            }, 1500);
        }
    }
});
