/**
 * Constantes utilizadas no código
 */
const input = document.querySelector('#data_input');
const button = document.querySelector('#btn');
const msg = document.querySelector('#msg_info');
const recarregar = document.getElementById('reload');
const reload_btn = document.getElementById('palpite_new_game')

const led = document.querySelectorAll('[data-js]');

//DEBUG para teste da aplicação
//A visualização do valor gerado pela API é exibido no console do navegador e no elemento 
//HTML com ID debug no canto inferior esquerdo da tela
const debug = document.querySelector('#debug');

const und = document.querySelector('[data-js="und"]');
const dez = document.querySelector('[data-js="dez"]');
const cen = document.querySelector('[data-js="cen"]');


const apiURL = "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300";


/**
 * Função para pegar os dados da API
 * @returns {Promise} Retorna um objeto com o valor gerado pela API e o StatusCode
 */
const getValues = async () => {
  const response = await fetch(apiURL);
  const data     = await response.json();
  getValueFromApi(data)
}

/**
 * Função para pegar o valor gerado pela API
 */
function getValueFromApi(data) {
  const { value, StatusCode } = data;

   //Debug código recebido pela API no console do navegador
  console.log(value);
  
  //Debug código recebido pela API no elemento HTML com ID debug
  //O elemento HTML com ID debug é exibido no canto inferior esquerdo da tela
  debug.innerHTML = value;

  if(StatusCode === 502) {
    msg.textContent = "ERRO";
    reload_btn.removeAttribute('class', 'd-none');
    ledError();
    jogarNovamente();
    return
  }

  button.addEventListener('click', () => {

    const inputNumber = input.value;
    const apiNumber = value;

    let convertNum = String(inputNumber).split("").map((inputNumber) => {
      return Number(inputNumber);
    });

    /**
     * Verifica se o valor digitado é igual ao valor gerado pela API
     * Se for igual, exibe uma mensagem de sucesso
     * Se o valor digitado for maior que o valor gerado pela API, exibe uma mensagem [É menor]
     * Se o valor digitado for menor que o valor gerado pela API, exibe uma mensagem [É maior]
     */
    if(inputNumber == apiNumber) {
      msg.textContent = "Você acertou!!!!";
    }
    if(inputNumber < apiNumber) {
      msg.textContent = "É maior";
    }
    if(inputNumber > apiNumber) {
      msg.textContent = "É menor";
    }

    /**
     * A lógica do programa consiste na utilização de segmentos gerados através de SVG
     * Cada número é composto por 7 segmentos, sendo eles:
     * 1 - Segmento superior
     * 2 - Segmento superior direito
     * 3 - Segmento inferior direito
     * 4 - Segmento inferior
     * 5 - Segmento inferior esquerdo
     * 6 - Segmento superior esquerdo
     * 7 - Segmento central
     * 
     * Cada segmento possui uma classe CSS que é responsável por exibir o segmento
     * Há uma classe CSS para cada número, sendo elas:
     * 1 - num-1
     * 2 - num-2
     * 3 - num-3
     * 4 - num-4
     * 5 - num-5
     * 6 - num-6
     * 7 - num-7
     * 8 - num-8
     * 9 - num-9
     * 0 - num-0
     * 
     * A função removeClasse() é responsável por adicionar ou remover a classe CSS do segmento
     * Auxilia na exibição do número digitado pelo usuário
     */

    // Gerencia o número da casa das centenas
    if(inputNumber > 99 && inputNumber <= 300) {
      dez.classList.toggle('hide')
      cen.classList.toggle('hide')
      und.setAttribute('class', 'num-'+convertNum[0]);
      dez.setAttribute('class', 'num-'+convertNum[1]);
      cen.setAttribute('class', 'num-'+convertNum[2]);
    }

    // Gerencia o número da casa das dezenas
    if(inputNumber > 9 && inputNumber < 100){
      und.setAttribute('class', 'num-'+convertNum[0]);
      dez.setAttribute('class', 'num-'+convertNum[1]);
      cen.setAttribute('class', 'hide');
    }

    // Gerencia o número da casa das unidades
    if(inputNumber > 0 && inputNumber < 10){
      dez.setAttribute('class','hide')
      cen.setAttribute('class','hide')
      und.setAttribute('class', 'num-'+convertNum[0]);
    }

    // Gerencia o número igual ao valor gerado pela API
    if(inputNumber == apiNumber){
      ledWin();
      reload_btn.removeAttribute('class', 'd-none');
      jogarNovamente();
    }
    
  })
}

/**
 * Função para exibir o LED vermelho
 * Função para exibir o erro na tela - Código 502
 * Exibe o botão para jogar novamente
 * Setando O input e o botão como desabilitado
 */
function ledError() {
  dez.classList.toggle('hide')
  cen.classList.toggle('hide')
  und.classList.add('num-5');
  dez.classList.add('num-0');
  cen.classList.add('num-2');
  msg.classList.add('erro');
  led[0].setAttribute('id', 'erro-palpite');
  led[1].setAttribute('id', 'erro-palpite');
  led[2].setAttribute('id', 'erro-palpite');
  button.disabled = true;
  input.disabled = true;
}

/**
 * Função para exibir o LED verde
 * Função para exibir o sucesso na tela
 * Exibe o botão para jogar novamente
 * Setando O input e o botão como desabilitado
 */
function ledWin() {
  msg.classList.add('acerto')
  led[0].setAttribute('id', 'winner-palpite');
  led[1].setAttribute('id', 'winner-palpite');
  led[2].setAttribute('id', 'winner-palpite');
  button.disabled = true;
  input.disabled = true;
}

/**
 * Remove a classe CSS do segmento setado inicialmente com display:none class="hide"
 */
function removeClasse(param, classe){
  if(param.classList.contains(classe)){
    param.classList.remove(classe);
  } else {
    param.classList.add(classe);
  }
}

/**
 * Botão novo Jogo
 * Função para recarregar a página
 * Gerando um novo número aleatório com a API
 * É possível gerar um erro 502 ao clicar no botão para atualizar a página
 * O erro 502 é gerado quando a API não consegue gerar um número aleatório
 * Mostrando o erro na tela com o LED vermelho
 */
function jogarNovamente(){
  recarregar.addEventListener('click', () => {
    location.reload();
  });
}

/**
 * Função para gerar um número aleatório com a API
 * A API gera um número aleatório entre 0 e 300
 * O número gerado é exibido no console e na tela do usuário no canto inferior esquerdo
 */
getValues()