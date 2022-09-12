const input = document.querySelector('#data_input');
const button = document.querySelector('#btn');
const msg = document.querySelector('#msg_info');
const recarregar = document.getElementById('reload');
const reload_btn = document.getElementById('palpite_new_game')

const led = document.querySelectorAll('[data-js]');

//DEBUG para teste da aplicação
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
   //Debug código recebido pela API
  console.log(value);
  
  debug.innerHTML = value;

  if(StatusCode === 502) {
    msg.textContent = "ERRO";
    reload_btn.removeAttribute('class', 'd-none');
    ledError();
    jogarNovamente();
    return
  }

  button.addEventListener('click', () => {
    // event.preventDefault();

    const inputNumber = input.value;
    const apiNumber = value;

    let convertNum = String(inputNumber).split("").map((inputNumber) => {
      return Number(inputNumber);
    });


    // console.log(testeVal);

    /**
     * Verifica se o valor digitado é igual ao valor gerado pela API
     * Se for igual, exibe uma mensagem de sucesso
     * Se o valor digitado for maior que o valor gerado pela API, exibe uma mensagem [É menor]
     * Se o valor digitado for menor que o valor gerado pela API, exibe uma mensagem [É maior]
     */
    if(inputNumber == apiNumber) {
      msg.textContent = "Você acertou!!!!";
      // return;
    }
    if(inputNumber < apiNumber) {
      msg.textContent = "É maior";
      // return;
    }
    if(inputNumber > apiNumber) {
      msg.textContent = "É menor";
      // return;
    }
    if(inputNumber > 99 && inputNumber <= 300) {
      dez.classList.toggle('hide')
      cen.classList.toggle('hide')
      und.setAttribute('class', 'num-'+convertNum[0]);
      dez.setAttribute('class', 'num-'+convertNum[1]);
      cen.setAttribute('class', 'num-'+convertNum[2]);
      // return;
    }
    if(inputNumber > 9 && inputNumber < 100){
      und.setAttribute('class', 'num-'+convertNum[0]);
      dez.setAttribute('class', 'num-'+convertNum[1]);
      // removeClasse(cen, 'hide');
      cen.setAttribute('class', 'hide');
      // return;
    }
    if(inputNumber > 0 && inputNumber < 10){
      
      dez.setAttribute('class','hide')
      cen.setAttribute('class','hide')
      und.setAttribute('class', 'num-'+convertNum[0]);
      // return;
    }
    if(inputNumber == apiNumber){
      ledWin();
      reload_btn.removeAttribute('class', 'd-none');
      jogarNovamente();
    }
    
  })
}

/**
 * Código 502
 * Função para exibir o erro na tela
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
function ledWin() {
  msg.classList.add('acerto')
  led[0].setAttribute('id', 'winner-palpite');
  led[1].setAttribute('id', 'winner-palpite');
  led[2].setAttribute('id', 'winner-palpite');
  button.disabled = true;
  input.disabled = true;
}

//Oculta classe CSS
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
 */
function jogarNovamente(){
  recarregar.addEventListener('click', () => {
    location.reload();
  });
}

// Executa a função assíncrona
getValues()