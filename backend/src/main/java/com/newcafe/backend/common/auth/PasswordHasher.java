package com.newcafe.backend.common.auth;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {
  private static final int ITERATIONS = 120_000;
  private static final int KEY_BITS = 256;
  private final SecureRandom random = new SecureRandom();

  public String hash(String password) {
    byte[] salt = new byte[16];
    random.nextBytes(salt);
    return "pbkdf2$" + ITERATIONS + "$" + Base64.getEncoder().encodeToString(salt)
        + "$" + Base64.getEncoder().encodeToString(derive(password, salt, ITERATIONS));
  }

  public boolean matches(String password, String encoded) {
    if (encoded == null || !encoded.startsWith("pbkdf2$")) return false;
    try {
      String[] parts = encoded.split("\\$");
      if (parts.length != 4) return false;
      int iterations = Integer.parseInt(parts[1]);
      if (iterations < 10_000 || iterations > 1_000_000) return false;
      byte[] salt = Base64.getDecoder().decode(parts[2]);
      byte[] stored = Base64.getDecoder().decode(parts[3]);
      return MessageDigest.isEqual(derive(password, salt, iterations), stored);
    } catch (IllegalArgumentException e) {
      return false;
    }
  }

  private byte[] derive(String password, byte[] salt, int iterations) {
    PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, KEY_BITS);
    try {
      return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
    } catch (Exception e) {
      throw new IllegalStateException("비밀번호를 처리할 수 없습니다.", e);
    } finally {
      spec.clearPassword();
    }
  }
}
