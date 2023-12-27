-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema tinlink
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tinlink
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tinlink` DEFAULT CHARACTER SET utf8 ;
USE `tinlink` ;

-- -----------------------------------------------------
-- Table `tinlink`.`cidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`cidade` (
  `cidade` INT NOT NULL AUTO_INCREMENT,
  `municipio` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(2) NOT NULL,
  `cep` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`cidade`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`usuario` (
  `codigo` INT NOT NULL AUTO_INCREMENT,
  `cidade` INT NOT NULL,
  `nome` VARCHAR(30) NOT NULL,
  `sobrenome` VARCHAR(30) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL,
  `endereco` VARCHAR(60) NOT NULL,
  `bairro` VARCHAR(60) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `senha` VARCHAR(60) NOT NULL,
  `celular` VARCHAR(15) NOT NULL,
  `confirmado` TINYINT NOT NULL,
  `nivel_acesso` VARCHAR(20) NOT NULL,
  `numero` INT NULL,
  `foto_perfil` TEXT NULL,
  `biografia` TEXT NULL,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`codigo`),
  INDEX `fk_usuario_cidade1_idx` (`cidade` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_cidade1`
    FOREIGN KEY (`cidade`)
    REFERENCES `tinlink`.`cidade` (`cidade`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`empresa` (
  `codigo` INT NOT NULL AUTO_INCREMENT,
  `cidade` INT NOT NULL,
  `nome` VARCHAR(30) NOT NULL,
  `endereco` VARCHAR(60) NOT NULL,
  `bairro` VARCHAR(60) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `senha` VARCHAR(60) NOT NULL,
  `celular` VARCHAR(15) NOT NULL,
  `numero` INT NOT NULL,
  `cnpj` VARCHAR(18) NOT NULL,
  `confirmado` TINYINT NOT NULL,
  `foto_empresa` TEXT NULL,
  UNIQUE INDEX `cpf_UNIQUE` (`cnpj` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`codigo`),
  INDEX `fk_empresa_cidade1_idx` (`cidade` ASC) VISIBLE,
  CONSTRAINT `fk_empresa_cidade1`
    FOREIGN KEY (`cidade`)
    REFERENCES `tinlink`.`cidade` (`cidade`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`vaga`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`vaga` (
  `codigo` INT NOT NULL AUTO_INCREMENT,
  `empresa` INT NOT NULL,
  `titulo` VARCHAR(60) NOT NULL,
  `descricao` TEXT NOT NULL,
  `definir` TINYINT NOT NULL,
  `vaga_ocupada` TINYINT NOT NULL,
  `abertura` DATETIME NOT NULL,
  `requisitos` TEXT NULL,
  `fechamento` DATETIME NULL,
  `pagamento_diaria` DOUBLE NULL,
  `pagamento_semanal` DOUBLE NULL,
  `pagamento_mensal` DOUBLE NULL,
  PRIMARY KEY (`codigo`, `empresa`),
  INDEX `fk_vaga_empresa_idx` (`empresa` ASC) VISIBLE,
  CONSTRAINT `fk_vaga_empresa`
    FOREIGN KEY (`empresa`)
    REFERENCES `tinlink`.`empresa` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`curriculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`curriculo` (
  `codigo` INT NOT NULL AUTO_INCREMENT,
  `usuario` INT NOT NULL,
  `arquivo` TEXT NOT NULL,
  PRIMARY KEY (`codigo`, `usuario`),
  INDEX `fk_curriculo_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_curriculo_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `tinlink`.`usuario` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`candidatura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`candidatura` (
  `usuario` INT NOT NULL,
  `vaga` INT NOT NULL,
  `empresa` INT NOT NULL,
  `aprovado` TINYINT NOT NULL,
  `data_encontro` DATETIME NULL,
  `endereco_encontro` VARCHAR(60) NULL,
  `numero_encontro` INT NULL,
  `bairro_encontro` VARCHAR(60) NULL,
  `detalhes_do_encontro` TEXT NULL,
  PRIMARY KEY (`usuario`, `vaga`, `empresa`),
  INDEX `fk_usuario_has_vaga_vaga1_idx` (`vaga` ASC, `empresa` ASC) VISIBLE,
  INDEX `fk_usuario_has_vaga_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_has_vaga_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `tinlink`.`usuario` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_vaga_vaga1`
    FOREIGN KEY (`vaga` , `empresa`)
    REFERENCES `tinlink`.`vaga` (`codigo` , `empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`denuncia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`denuncia` (
  `usuario` INT NOT NULL,
  `vaga` INT NOT NULL,
  `empresa` INT NOT NULL,
  `motivo` TEXT NOT NULL,
  `arquivo` TEXT NULL,
  PRIMARY KEY (`usuario`, `vaga`, `empresa`),
  INDEX `fk_usuario_has_vaga_vaga2_idx` (`vaga` ASC, `empresa` ASC) VISIBLE,
  INDEX `fk_usuario_has_vaga_usuario2_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_has_vaga_usuario2`
    FOREIGN KEY (`usuario`)
    REFERENCES `tinlink`.`usuario` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_vaga_vaga2`
    FOREIGN KEY (`vaga` , `empresa`)
    REFERENCES `tinlink`.`vaga` (`codigo` , `empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tinlink`.`notificacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinlink`.`notificacao` (
  `codigo` INT NOT NULL AUTO_INCREMENT,
  `usuario` INT NOT NULL,
  `data` DATETIME NOT NULL,
  `conteudo` TEXT NOT NULL,
  PRIMARY KEY (`codigo`, `usuario`),
  INDEX `fk_notificacao_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_notificacao_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `tinlink`.`usuario` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
