package pokemap.security;

import org.junit.jupiter.api.Test;

import pokemap.security.Crypt;

public class CryptTest {

	/**
	 * 암복호화 테스트
	 */
	@Test
	public void 암복호화() {
		System.out.println("url : " + Crypt.encrypt("jdbc:postgresql://localhost:5432/postgres"));
		System.out.println("user : " + Crypt.encrypt("test"));
		System.out.println("password : " + Crypt.encrypt("test"));

		System.out.println(Crypt.decrypt("GvEa084OoJKPfNVpNHbfpFo1vV"));
		System.out.println(Crypt.decrypt("lxX28XJgkJm+rg=="));
	}
}
