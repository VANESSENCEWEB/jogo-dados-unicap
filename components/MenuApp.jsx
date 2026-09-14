'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import RastroDado from './RastroDado';

export const MENU_MOBILE_PX = 720;

function IconeSom({ ligado }) {
  return ligado ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h3l4 4V6L7 10H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18.2 6.2a8 8 0 0 1 0 11.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h3l4 4V6L7 10H4z" fill="currentColor" />
      <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function IconeTela({ cheia }) {
  return cheia ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8H4v4M16 8h4v4M8 16H4v-4M16 16h4v-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconeReset() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 1 0 2.2-5.5M4 4v5h5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function MenuApp({
  aberto,
  onAberto,
  somLigado,
  telaCheia,
  onComoJogar,
  onSom,
  onTelaCheia,
  onResetar,
}) {
  const [rastro, setRastro] = useState(false);
  const [noCliente, setNoCliente] = useState(false);

  useEffect(() => {
    setNoCliente(true);
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > MENU_MOBILE_PX) onAberto(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onAberto]);

  useEffect(() => {
    document.body.classList.toggle('menu-aberto', aberto);
    return () => document.body.classList.remove('menu-aberto');
  }, [aberto]);

  function fecharE(acao) {
    onAberto(false);
    acao();
  }

  const drawer = (
    <>
      {aberto ? (
        <button
          type="button"
          className="menu-fundo"
          aria-label="Fechar menu"
          onClick={() => onAberto(false)}
        />
      ) : null}
      <nav
        id="menu-principal"
        className={`app-nav ${aberto ? 'aberto' : ''}`}
        aria-label="Menu do jogo"
        aria-hidden={!aberto}
        inert={!aberto || undefined}
      >
        <div className="app-nav-cabecalho">
          <p className="app-nav-titulo">Manual</p>
          <button type="button" className="menu-fechar" onClick={() => onAberto(false)}>
            Fechar
          </button>
        </div>
        <ul>
          <li>
            <button type="button" onClick={() => fecharE(onComoJogar)}>
              Como jogar
            </button>
          </li>
          <li>
            <button type="button" onClick={() => fecharE(onSom)} aria-pressed={somLigado}>
              {somLigado ? 'Som ligado' : 'Som desligado'}
            </button>
          </li>
          <li>
            <button type="button" onClick={() => fecharE(onTelaCheia)}>
              {telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
            </button>
          </li>
          <li>
            <button type="button" className="perigo" onClick={() => fecharE(onResetar)}>
              Resetar temporada
            </button>
          </li>
        </ul>
        <p className="app-nav-status">
          <i />
          Save
        </p>
      </nav>
    </>
  );

  return (
    <>
    <header
      className={`app-header ${rastro ? 'tem-rastro' : ''}`}
      onMouseEnter={() => {
        if (!window.matchMedia('(pointer: coarse)').matches) setRastro(true);
      }}
      onMouseLeave={() => setRastro(false)}
    >
      <span className="nav-neon nav-neon-top" aria-hidden="true" />
      <span className="nav-neon nav-neon-bottom" aria-hidden="true" />
      <span className="nav-neon nav-neon-lado nav-neon-esq" aria-hidden="true" />
      <span className="nav-neon nav-neon-lado nav-neon-dir" aria-hidden="true" />
      <div className="app-brand">
        <strong>
          <img
            className="app-brand-dado"
            src="/icon.png"
            alt=""
            width="36"
            height="36"
          />
          <span className="app-brand-nome">Jogue Dados</span>
        </strong>
      </div>

      <div className="app-utils">
        <button
          type="button"
          className="icon-btn"
          aria-pressed={somLigado}
          aria-label={somLigado ? 'Desligar som' : 'Ligar som'}
          title={somLigado ? 'Som ligado (M)' : 'Som desligado (M)'}
          onClick={onSom}
        >
          <IconeSom ligado={somLigado} />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-pressed={telaCheia}
          aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
          title="Tela cheia (F)"
          onClick={onTelaCheia}
        >
          <IconeTela cheia={telaCheia} />
        </button>
        <button
          type="button"
          className="icon-btn perigo"
          aria-label="Resetar temporada"
          title="Resetar temporada (⇧ R)"
          onClick={onResetar}
        >
          <IconeReset />
        </button>
        <p className="app-nav-status">
          <i />
          Save
        </p>
      </div>

      <button
        type="button"
        className={`botao-manual ${aberto ? 'aberto' : ''}`}
        aria-expanded={aberto}
        aria-label={aberto ? 'Fechar manual' : 'Abrir manual'}
        aria-controls="menu-principal"
        onClick={() => onAberto(!aberto)}
      >
        {aberto ? 'Fechar' : 'Manual'}
      </button>
    </header>
    {noCliente ? createPortal(drawer, document.body) : null}
    <RastroDado ativo={rastro} />
    </>
  );
}
